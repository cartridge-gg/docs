---
showOutline: 2
description: Technical deep-dive into how Cartridge's vRNG produces verifiable onchain randomness using EC-VRF on the Stark curve.
title: How vRNG Works
---

# How vRNG Works

## The Onchain Randomness Problem

Blockchains are deterministic by design — every node must compute the same result for every transaction.
This makes genuine randomness impossible to produce from within a smart contract alone.

Common workarounds and their weaknesses:

| Approach | Problem |
| --- | --- |
| Block hash / timestamp | Miners/sequencers can influence or predict these values |
| Commit-reveal schemes | Require multiple transactions across multiple blocks, adding latency and cost |
| External oracles (e.g. Chainlink VRF) | Randomness arrives in a *separate* transaction, breaking atomicity — your game action resolves in one tx, but the random outcome arrives later |

For onchain games, these tradeoffs are unacceptable.
A dice roll that takes two transactions and 30 seconds breaks the gameplay loop.
A sequencer that can predict outcomes breaks the game's integrity.

## The vRNG Solution: EC-VRF on the Stark Curve

Cartridge's vRNG solves this using an **Elliptic Curve Verifiable Random Function (EC-VRF)** built on the Stark curve — the native curve of Starknet.

A VRF is a cryptographic primitive with a key property: given a secret key and an input (seed), it produces an output that is:

1. **Deterministic** — the same seed always produces the same output
2. **Unpredictable** — without the secret key, the output is computationally indistinguishable from random
3. **Verifiable** — the output comes with a proof that anyone can check using only the public key

This is exactly what onchain randomness needs: a trusted party generates the random value off-chain, but the contract can *prove* the value wasn't manipulated.

### Proof Structure

The VRF provider generates a proof consisting of:

- **gamma** — a point on the Stark curve (the core VRF output)
- **c** — a scalar challenge value
- **s** — a scalar response value
- **sqrt_ratio_hint** — an optimization hint for efficient onchain verification

The random value is derived from `gamma` via hashing.
The `(c, s)` pair constitutes a Schnorr-like proof that `gamma` was correctly computed from the seed and the provider's secret key.

### Seed Construction

The seed is computed deterministically using a Poseidon hash of context-specific data:

- **`Source::Nonce(address)`**: `poseidon_hash(nonce, address, consumer_contract, chain_id)`
- **`Source::Salt(salt)`**: `poseidon_hash(salt, consumer_contract, chain_id)`

Including the consumer contract address and chain ID prevents cross-contract and cross-chain replay.
The `Nonce` source auto-increments, guaranteeing a unique seed per request without the caller needing to manage entropy.

## Transaction Flow: Nested Outside Execution

The key innovation is how vRNG delivers randomness **atomically** — proof generation, verification, and consumption all happen in a single transaction.
This is achieved through a nested [SNIP-9](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-9.md) `execute_from_outside_v2` pattern:

```
┌─────────────────────────────────────────────────────────────┐
│  Paymaster / Forwarder                                      │
│  calls execute_from_outside_v2 on VRF Account               │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  VRF Account (outer execution, signed by VRF key)      │ │
│  │                                                        │ │
│  │  1. submit_random(seed, proof)                         │ │
│  │     → verifies proof against public key                │ │
│  │     → stores random value in transient storage         │ │
│  │                                                        │ │
│  │  2. execute_from_outside_v2 on Player Account          │ │
│  │     ┌───────────────────────────────────────────────┐  │ │
│  │     │  Player Account (inner execution,             │  │ │
│  │     │  signed by player's passkey)                  │  │ │
│  │     │                                               │  │ │
│  │     │  1. request_random(caller, source)            │  │ │
│  │     │     → signals VRF intent                      │  │ │
│  │     │                                               │  │ │
│  │     │  2. game_action() on Game Contract            │  │ │
│  │     │     → calls consume_random(source)            │  │ │
│  │     │     → reads verified random value             │  │ │
│  │     │     → uses it in game logic                   │  │ │
│  │     └───────────────────────────────────────────────┘  │ │
│  │                                                        │ │
│  │  3. assert_consumed()                                  │ │
│  │     → ensures random value was used                    │ │
│  │     → clears transient storage                         │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Step by Step

1. **Player signs their game action** — the player's wallet signs a multicall containing `request_random` + the game call (e.g. `roll_dice`).
This is the inner SNIP-9 outside execution.

2. **Cartridge's vRNG server intercepts the request** — the server sees the `request_random` call, computes the seed from the source parameters, and generates the VRF proof using its secret key.

3. **Server wraps with proof injection** — the server constructs an outer SNIP-9 execution signed by the VRF Account that prepends `submit_random(seed, proof)` before executing the player's calls.

4. **Onchain verification** — `submit_random` verifies the EC-VRF proof against the VRF Account's stored public key.
If valid, the derived random value is stored in transient storage for this transaction.

5. **Game consumes randomness** — when the game contract calls `consume_random(source)`, it reads the verified value from the VRF provider's storage.

6. **Cleanup** — `assert_consumed` ensures the random value was actually used and clears storage, preventing stale values from persisting.

### Why Nested Execution?

The nesting serves two purposes:

- **Proof injection without player awareness** — the player only signs their game action.
The VRF proof is added by the server in the outer layer, invisible to the player.
- **Atomic execution** — proof verification and consumption happen in the same transaction.
There is no window where the random value exists but hasn't been used, and no second transaction to wait for.

## Security Model

### Current (Phase 0)

The security assumption is that the **VRF provider has not revealed its secret key** and does not collude with players.

Given this assumption:
- The provider cannot choose a favorable random value — the VRF is deterministic for a given seed, and the seed is derived from onchain state the provider doesn't control.
- Players cannot predict the random value — they don't have the provider's secret key.
- Anyone can verify after the fact — the proof and public key are onchain.

The main trust assumption is that the provider isn't selectively *withholding* unfavorable results (censorship).

### Future (TEE)

The planned migration to a Trusted Execution Environment (TEE) will eliminate the trust assumption on the provider operator.
The secret key will be generated and held within the TEE, ensuring that even the operator cannot extract it or selectively withhold results.
