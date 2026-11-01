---
showOutline: 2
description: Technical deep-dive into how Cartridge's vRNG produces verifiable onchain randomness using EC-VRF on the Stark curve.
title: How vRNG Works
---

# How vRNG Works

## The Onchain Randomness Problem

Blockchains are deterministic by design --- every node must compute the same result for every transaction.
This makes genuine randomness impossible to produce from within a smart contract alone.

Common workarounds and their weaknesses:

| Approach | Problem |
| --- | --- |
| Block hash / timestamp | Miners/sequencers can influence or predict these values |
| Commit-reveal schemes | Require multiple transactions across multiple blocks, adding latency and cost |
| Hash of onchain state | Anyone can compute the same hash and predict the outcome before submitting |
| External oracles (e.g. Chainlink VRF) | Randomness arrives in a *separate* transaction, breaking atomicity --- your game action resolves in one tx, but the random outcome arrives later |

For onchain games, these tradeoffs are unacceptable.
A dice roll that takes two transactions and 30 seconds breaks the gameplay loop.
A sequencer that can predict outcomes breaks the game's integrity.

## The Core Idea

The [Cartridge Paymaster](/services/paymaster) already acts as an offchain executor --- it wraps player transactions for gas sponsorship and submits them onchain via Starknet's [SNIP-9](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-9.md) `execute_from_outside` protocol.

The vRNG extends this existing role.
In addition to sponsoring gas, the paymaster holds a **secret key** and uses it to generate a verifiable random number as part of the same execution flow.
The random value and its cryptographic proof are injected into the transaction *before* the player's game action executes, so the game contract can consume verified randomness atomically --- no extra transactions, no waiting.

This works because the paymaster is already in the transaction path.
The vRNG is not a separate oracle service; it's a natural extension of the execution infrastructure that's already there.

## Why Not Just Hash?

A hash function like `hash(seed)` is deterministic and publicly computable --- anyone with the seed can compute the output.
Since seeds are derived from onchain state, a player could predict the outcome before submitting their transaction.

A **Verifiable Random Function (VRF)** adds a secret key to the computation: `VRF(secret_key, seed) → (output, proof)`.
Only the key holder can compute the output, but anyone can *verify* it was computed correctly using the public key.

| | Hash | VRF |
| --- | --- | --- |
| **Who can compute** | Anyone with the input | Only the secret key holder |
| **Predictable?** | Yes --- inputs are public | No --- requires the secret key |
| **Verifiable?** | Trivially (recompute it) | Yes --- via cryptographic proof |
| **Manipulable?** | No (but predictable = exploitable) | No --- deterministic for a given seed and key |

The "verifiable" part is what distinguishes a VRF from simple encryption --- the proof ensures the key holder can't lie about what the output should be for a given input.

## Cryptographic Details

Cartridge's vRNG uses an **Elliptic Curve VRF (EC-VRF)** built on the Stark curve --- the native curve of Starknet, which enables efficient onchain verification via Poseidon hashing.

### Proof Structure

The VRF provider generates a proof consisting of:

- **gamma** --- a point on the Stark curve (the core VRF output)
- **c** --- a scalar challenge value
- **s** --- a scalar response value
- **sqrt_ratio_hint** --- an optimization hint for efficient onchain verification

The random value is derived from `gamma` via hashing.
The `(c, s)` pair constitutes a Schnorr-like proof that `gamma` was correctly computed from the seed and the provider's secret key.

### Seed Construction

The seed is computed deterministically using a Poseidon hash of context-specific data:

- **`Source::Nonce(address)`**: `poseidon_hash(nonce, address, consumer_contract, chain_id)`
- **`Source::Salt(salt)`**: `poseidon_hash(salt, consumer_contract, chain_id)`

Including the consumer contract address and chain ID prevents cross-contract and cross-chain replay.
The `Nonce` source auto-increments, guaranteeing a unique seed per request without the caller needing to manage entropy.

## Transaction Flow

The player signs their game action as normal.
The paymaster intercepts it, generates the VRF proof, and wraps everything into a nested SNIP-9 `execute_from_outside_v2` structure:

```
┌─────────────────────────────────────────────────────────────┐
│  Paymaster                                                  │
│  calls execute_from_outside_v2 on VRF Account               │
│                                                             │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  VRF Account (outer execution, signed by provider key) │ │
│  │                                                        │ │
│  │  1. submit_random(seed, proof)                         │ │
│  │     → verifies proof against stored public key         │ │
│  │     → stores random value for this transaction         │ │
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
│  │     → clears storage                                   │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Step by Step

1. **Player signs their game action** --- the player's wallet signs a multicall containing `request_random` + the game call (e.g. `roll_dice`).
This is the inner SNIP-9 outside execution.

2. **Paymaster intercepts** --- the paymaster sees the `request_random` call, computes the seed from the source parameters, and generates the VRF proof using its secret key.

3. **Paymaster wraps with proof injection** --- the paymaster constructs an outer SNIP-9 execution signed by the VRF Account that prepends `submit_random(seed, proof)` before executing the player's calls.

4. **Onchain verification** --- `submit_random` verifies the EC-VRF proof against the VRF Account's stored public key.
If valid, the derived random value is stored for this transaction.

5. **Game consumes randomness** --- when the game contract calls `consume_random(source)`, it reads the verified value from the VRF provider's storage.

6. **Cleanup** --- `assert_consumed` ensures the random value was actually used and clears storage, preventing stale values from persisting.

### Why Nested Execution?

The nesting serves two purposes:

- **Proof injection without player awareness** --- the player only signs their game action.
The VRF proof is added by the paymaster in the outer layer, invisible to the player.
- **Atomic execution** --- proof verification and consumption happen in the same transaction.
There is no window where the random value exists but hasn't been used, and no second transaction to wait for.

## Security Model

### Current (Phase 0)

The security assumption is that the **paymaster has not revealed its VRF secret key** and does not collude with players.

Given this assumption:
- The provider cannot choose a favorable random value --- the VRF is deterministic for a given seed, and the seed is derived from onchain state the provider doesn't control.
- Players cannot predict the random value --- they don't have the provider's secret key.
- Anyone can verify after the fact --- the proof and public key are onchain.

The main trust assumption is that the provider isn't selectively *withholding* unfavorable results (censorship).

### Future (TEE)

The planned migration to a Trusted Execution Environment (TEE) will eliminate the trust assumption on the provider operator.
The secret key will be generated and held within the TEE, ensuring that even the operator cannot extract it or selectively withhold results.
