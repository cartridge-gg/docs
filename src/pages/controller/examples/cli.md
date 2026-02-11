---
showOutline: 1
title: Controller CLI
description: Execute Starknet transactions from the command line using Cartridge Controller sessions with human-in-the-loop authorization.
---

# CLI

The Controller CLI enables automated execution of Starknet transactions from the terminal.
It uses a human-in-the-loop workflow: you authorize sessions in the browser, then execute transactions from the command line without further prompts.

This is useful for scripting, backend automation, and AI agent integration.

## Installation

Install via the command-line:

```bash
curl -fsSL https://raw.githubusercontent.com/cartridge-gg/controller-cli/main/install.sh | bash
```

Or install via Cargo:

```bash
cargo install --git https://github.com/cartridge-gg/controller-cli
```

## Quick Start

### 1. Generate a keypair

```bash
controller generate-keypair
```

This creates a session signing keypair and stores it locally in `~/.config/controller-cli/`.

### 2. Define policies

Create a `policies.json` file specifying which contracts and methods the session can call:

```json
{
  "contracts": {
    "0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": {
      "name": "ETH Token",
      "methods": [
        {
          "name": "transfer",
          "entrypoint": "transfer",
          "description": "Transfer ETH tokens to another address"
        }
      ]
    }
  }
}
```

This uses the same policy format as the [JavaScript SDK](/controller/sessions#defining-policies), with contract addresses mapping to allowed methods.

### 3. Register a session

Using a policy file:

```bash
controller register-session --file policies.json --chain-id SN_MAIN
```

Or use a preset for popular games/apps:

```bash
controller register-session --preset loot-survivor --chain-id SN_MAIN
```

Available presets include: `loot-survivor`, `influence`, `realms`, `pistols`, `dope-wars`, and more.

This prints an authorization URL. Open it in your browser and approve the session.
The CLI automatically polls for authorization and stores the session credentials once approved.

### 4. Execute transactions

Single call:

```bash
controller execute \
  --contract 0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 \
  --entrypoint transfer \
  --calldata 0x1234,0x100,0x0 \
  --rpc-url https://api.cartridge.gg/x/starknet/mainnet \
  --wait
```

Multiple calls from a file:

```bash
controller execute --file calls.json --wait
```

Where `calls.json` contains:

```json
{
  "calls": [
    {
      "contractAddress": "0x4718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d",
      "entrypoint": "transfer",
      "calldata": ["0x1234", "0x100", "0x0"]
    }
  ]
}
```

## Commands

### `generate-keypair`

Creates a new session signing keypair and stores it locally.

```bash
controller generate-keypair
```

### `register-session`

Generates an authorization URL and waits for the user to approve in the browser.
Polls the API automatically (up to 6 minutes).

```bash
# Using a policy file
controller register-session --file <policy_file> --chain-id SN_MAIN

# Using a preset
controller register-session --preset <preset_name> --chain-id SN_MAIN
```

**Presets:** Popular games/apps have pre-defined policies:
- `loot-survivor` — Loot Survivor game
- `influence` — Influence space strategy
- `realms` — Realms world
- `pistols` — Pistols at Dawn
- `dope-wars` — Dope Wars

See all presets at [github.com/cartridge-gg/presets](https://github.com/cartridge-gg/presets/tree/main/configs).

### `execute`

Executes a transaction using the active session.

```bash
# Single call
controller execute --contract <address> --entrypoint <name> --calldata <hex,hex,...> [--rpc-url <url>] [--no-paymaster] [--wait] [--timeout <seconds>]

# Multiple calls
controller execute --file <calls.json> [--rpc-url <url>] [--no-paymaster] [--wait] [--timeout <seconds>]
```

| Flag | Description | Default |
|------|-------------|---------|
| `--rpc-url` | RPC endpoint URL | From session registration |
| `--no-paymaster` | Bypass paymaster, pay fees directly | off |
| `--wait` | Wait for transaction confirmation | off |
| `--timeout` | Confirmation timeout in seconds | 300 |

### `status`

Displays current session status, keypair info, and expiration details.

```bash
controller status
```

Returns one of three states: `no_session`, `keypair_only`, or `active`.

### `lookup`

Resolves Cartridge controller usernames to addresses or vice versa.

```bash
# Look up addresses for usernames
controller lookup --usernames shinobi,sensei

# Look up usernames for addresses
controller lookup --addresses 0x123...,0x456...
```

Output format: `username:address` pairs.

### `store-session`

Manually store session credentials from authorization (advanced use).

```bash
controller store-session <credentials_json>
```

### `clear`

Removes all stored session data and keypairs.

```bash
controller clear [--yes]
```

## Global Flags

All commands support:

| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--no-color` | Disable colored terminal output |

## Network Selection

Always be explicit about network using `--chain-id` or `--rpc-url`:

| Chain ID | RPC URL | Usage |
|----------|---------|-------|
| `SN_MAIN` | `https://api.cartridge.gg/x/starknet/mainnet` | Starknet Mainnet |
| `SN_SEPOLIA` | `https://api.cartridge.gg/x/starknet/sepolia` | Starknet Sepolia |

For presets, use `--chain-id`. For policy files, use `--rpc-url`.

## Paymaster Control

By default, transactions use the paymaster (free execution). If the paymaster is unavailable, the transaction **fails** rather than falling back to user-funded execution.

Use `--no-paymaster` to bypass the paymaster and pay with user funds:

```bash
controller execute \
  --contract 0x... \
  --entrypoint transfer \
  --calldata 0x... \
  --no-paymaster
```

## Configuration

The CLI reads configuration from `~/.config/controller-cli/config.toml`:

```toml
[session]
storage_path = "~/.config/controller-cli"
default_chain_id = "SN_SEPOLIA"
default_rpc_url = "https://api.cartridge.gg/x/starknet/sepolia"

[cli]
json_output = false
use_colors = true
callback_timeout_seconds = 360
```

Settings can be overridden with environment variables:

| Variable | Description |
|----------|-------------|
| `CARTRIDGE_STORAGE_PATH` | Session storage location |
| `CARTRIDGE_CHAIN_ID` | Default chain ID |
| `CARTRIDGE_RPC_URL` | Default RPC endpoint |
| `CARTRIDGE_API_URL` | API endpoint for session queries |
| `CARTRIDGE_JSON_OUTPUT` | Default to JSON output (`true`/`1`) |

Precedence: CLI flags > environment variables > config file.

## Error Handling

Common errors and how to fix them:

| Error | Meaning | Fix |
|-------|---------|-----|
| `NoSession` | No keypair found | Run `generate-keypair` |
| `SessionExpired` | Session has expired | Run `register-session` again |
| `InvalidSessionData` | Corrupted session data | Run `clear` and start over |
| `TransactionFailed` | Execution failed | Check policies and calldata |
| `CallbackTimeout` | Authorization timed out (360s) | Run `register-session` again |
| `ManualExecutionRequired` | No authorized session for this transaction | Register session with appropriate policies |
| `InvalidInput` | Invalid input parameters | Check command syntax and calldata |

When using `--json`, errors return structured responses with machine-readable codes and recovery hints:

```json
{
  "status": "error",
  "error_code": "SessionExpired",
  "message": "Session expired at 2025-01-01 00:00:00 UTC",
  "recovery_hint": "Run 'controller register-session' to create a new session"
}
```

## AI Agent Integration

For AI agents and LLMs integrating with the CLI, see the [LLM Usage Guide](https://github.com/cartridge-gg/controller-cli/blob/main/LLM_USAGE.md) in the repository for detailed integration patterns and best practices.

## Source

[github.com/cartridge-gg/controller-cli](https://github.com/cartridge-gg/controller-cli)
