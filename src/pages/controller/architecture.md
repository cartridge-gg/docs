---
showOutline: 1
title: Architecture
description: Technical overview of the Controller smart contract architecture, security model, and on-chain mechanisms.
---

# Architecture

This page provides a technical overview of the Controller smart contract for developers who need to understand the on-chain mechanisms.
For user-facing documentation, see [Sessions](/controller/sessions) and [Signer Management](/controller/signer-management).

## Account Model

The Controller is a smart contract wallet with support for multiple owners and flexible signer types.

### Components

The account is built from modular components:

| Component | Purpose |
|-----------|---------|
| **multiple_owners** | Manages account owners (add/remove signers) |
| **session** | Session-based transaction authorization |
| **outside_execution** | Meta-transactions via SNIP-9 |
| **external_owners** | External contract-based ownership |
| **delegate_account** | Account delegation support |

### Owner Management

Owners are stored by their GUID (a hash identifying the signer).
Adding a new owner requires a signature from the new signer to prevent accidental misconfiguration.

```cairo
fn add_owner(owner: Signer, signature: SignerSignature)
fn remove_owner(owner: Signer)
fn is_owner(owner_guid: felt252) -> bool
```

## Signer Types

The Controller supports six cryptographic signature schemes:

| Type | Description | GUID Calculation |
|------|-------------|------------------|
| **Starknet** | Native Starknet curve (most gas-efficient) | `poseidon('Starknet Signer', pubkey)` |
| **Secp256k1** | Ethereum-compatible curve | `poseidon('Secp256k1 Signer', pubkey_hash)` |
| **Secp256r1** | Hardware security module support | `poseidon('Secp256r1 Signer', pubkey.low, pubkey.high)` |
| **Eip191** | Ethereum personal signatures | `poseidon('Eip191 Signer', eth_address)` |
| **Webauthn** | Passkey support for browsers/OS | `poseidon('Webauthn Signer', origin.len(), ...origin, rp_id_hash, pubkey)` |
| **SIWS** | Sign-In With Solana (Ed25519) | `poseidon('SIWS Signer', pubkey)` |

Each signer is uniquely identified by a GUID (hash of the signer data).
When a signer is added, a `SignerLinked` event is emitted with the GUID and full signer data.

## Sessions (On-Chain)

Sessions allow dapps to submit transactions on behalf of users without per-transaction approval.

### Session Structure

```cairo
struct Session {
    expires_at: u64,                // Expiration timestamp
    allowed_policies_root: felt252, // Merkle root of allowed methods
    metadata_hash: felt252,         // Hash of session metadata JSON
    session_key_guid: felt252,      // GUID of the session key
    guardian_key_guid: felt252,     // GUID of the guardian key (optional)
}
```

### How It Works

1. Dapp generates a session key pair
2. User signs an off-chain message with session parameters
3. Dapp submits transactions using a `SessionToken` containing:
   - The session data
   - Session key signature over `poseidon(tx_hash, session_hash)`
   - Guardian signature (if guardian key is set)
   - Merkle proofs for each call

### Session Token Format

Transactions using sessions must have signatures starting with the magic value `'session-token'`.

### Verification

**On-chain checks:**
- Session expiration (`expires_at > block_timestamp`)
- Session not revoked
- Session key signature validity
- Guardian signature validity (if `guardian_key_guid != 0`)
- Merkle proofs for each call against `allowed_policies_root`

### Session Management

```cairo
fn revoke_session(session_hash: felt252)
fn register_session(session: Session, guid_or_address: felt252)
fn is_session_revoked(session_hash: felt252) -> bool
fn is_session_registered(session_hash: felt252, guid_or_address: felt252) -> bool
```

### Session Caching

Sessions can cache the authorization signature to reduce transaction costs.
Set `cache_authorization: true` in the session token to enable this.
Subsequent transactions can then bypass authorization signature verification.

### Wildcard Policies

Sessions can use `'wildcard-policy'` as the `allowed_policies_root` to allow any method call, bypassing policy checks.

## Auth Flows

The following diagrams show how each provider authenticates users and signs transactions.

### ControllerProvider

![ControllerProvider flow](/controller-provider-flow.svg)

### SessionProvider

![SessionProvider flow](/session-provider-flow.svg)

### Headless

![Headless flow](/headless-flow.svg)

## Transaction Execution Flow

When you call `account.execute()` in your application, the Controller SDK determines the best execution path based on your session configuration and fee source settings.

### Execution Paths

The SDK supports two primary execution methods:

| Method | Description | Use Case |
|--------|-------------|----------|
| **Regular Execute** | Standard Starknet transaction signed by the account | User pays gas fees |
| **Execute From Outside** | Meta-transaction via SNIP-9 | Paymaster-sponsored (gasless) transactions |

### How Paymastered Transactions Work

When using the Cartridge Paymaster (the default for session-based transactions), your `account.execute()` call is automatically converted into a meta-transaction:

```
account.execute(calls)
    └── trySessionExecute(calls, feeSource)
            └── executeFromOutsideV3(calls, feeSource)
                    └── cartridge_addExecuteOutsideTransaction (RPC)
                            └── Paymaster submits transaction on-chain
```

The SDK:
1. Validates the session is active and policies match
2. Constructs an `OutsideExecution` message with a 10-minute validity window
3. Signs the message with the session key
4. Sends the signed payload to Cartridge's paymaster service
5. The paymaster submits the transaction on-chain and pays gas fees

If the paymaster is unavailable (e.g., on local Katana), the SDK falls back to regular execution where the user pays fees.

### Developer Experience

Game developers don't need to call `executeFromOutside` directly.
The abstraction is handled entirely by the SDK:

```typescript
// This is all you need - the SDK handles the rest
const result = await account.execute([
  {
    contractAddress: GAME_CONTRACT,
    entrypoint: "play_card",
    calldata: [cardId],
  },
]);
```

The SDK automatically:
- Uses `executeFromOutside` when paymaster is configured
- Falls back to regular execute when paymaster isn't available
- Opens the approval modal if the session is expired or policies don't match

### Outside Execution (SNIP-9)

The Controller implements [SNIP-9](https://github.com/starknet-io/SNIPs/blob/main/SNIPS/snip-9.md) for meta-transactions via `execute_from_outside_v3`.

This allows external contracts or relayers to submit transactions on behalf of the account by providing valid signatures.

```cairo
fn execute_from_outside_v3(
    outside_execution: OutsideExecution,
    signature: Span<felt252>
) -> Array<Span<felt252>>
```

The `OutsideExecution` struct specifies:
- `caller`: Who can submit (or `'ANY_CALLER'`)
- `nonce`: Channel-based nonce for replay protection
- `execute_after` / `execute_before`: Time window for validity
- `calls`: The calls to execute

For more details on outside execution, see the [Starknet.js documentation](https://starknetjs.com/docs/guides/account/outsideExecution/).

## Recovery (Threshold-Based)

Recovery is implemented as a separate component (`threshold_recovery_component`) for accounts with multiple signers.

When enabled, `threshold - 1` signers can initiate recovery to replace a signer.

### Escape Flow

1. **Trigger**: `threshold - 1` signers call `trigger_escape` with target and new signer
2. **Wait**: Security period must elapse (configurable)
3. **Execute**: `threshold - 1` signers call `execute_escape` to complete
4. **Expiry**: If not executed within expiry period, escape expires

### Configuration

```cairo
fn toggle_escape(is_enabled: bool, security_period: u64, expiry_period: u64)
fn get_escape_enabled() -> EscapeEnabled
fn get_escape() -> (Escape, EscapeStatus)
```

### Escape States

| Status | Description |
|--------|-------------|
| `None` | No escape triggered |
| `NotReady` | Escape triggered, waiting for security period |
| `Ready` | Security period elapsed, can be executed |
| `Expired` | Execution window passed, must cancel or re-trigger |

### Override Rules

A new escape can override an existing one only if it targets a signer with lower priority in the signer list.

## Upgrades

The account can be upgraded via the standard OpenZeppelin `upgrade` function, requiring owner authorization.

```cairo
fn upgrade(new_class_hash: ClassHash)
```

## Source Code

For full implementation details, see the [controller-cairo repository](https://github.com/cartridge-gg/controller/tree/main/packages/contracts).
