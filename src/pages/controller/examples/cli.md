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
controller generate-keypair --json
```

This creates a session signing keypair and stores it locally in `~/.config/cartridge/`.

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

```bash
controller register-session policies.json --json
```

This prints an authorization URL.
Open it in your browser and approve the session.
The CLI automatically polls for authorization and stores the session credentials once approved.

### 4. Execute transactions

Single call:

```bash
controller execute \
  --contract 0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 \
  --entrypoint transfer \
  --calldata 0x1234,0x100,0x0 \
  --wait --json
```

Multiple calls from a file:

```bash
controller execute --file calls.json --wait --json
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
controller generate-keypair [--json]
```

### `register-session`

Generates an authorization URL and waits for the user to approve in the browser.
Polls the API automatically (every 2 minutes, up to 3 attempts).

```bash
controller register-session <policy_file> [--json]
```

### `execute`

Executes a transaction using the active session.

```bash
# Single call
controller execute --contract <address> --entrypoint <name> --calldata <hex,hex,...> [--wait] [--timeout <seconds>] [--json]

# Multiple calls
controller execute --file <calls.json> [--wait] [--timeout <seconds>] [--json]
```

| Flag | Description | Default |
|------|-------------|---------|
| `--wait` | Wait for transaction confirmation | off |
| `--timeout` | Confirmation timeout in seconds | 300 |

### `status`

Displays current session status, keypair info, and expiration details.

```bash
controller status [--json]
```

Returns one of three states: `no_session`, `keypair_only`, or `active`.

### `clear`

Removes all stored session data and keypairs.

```bash
controller clear [--yes] [--json]
```

## Global Flags

All commands support:

| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--no-color` | Disable colored terminal output |

## Configuration

The CLI reads configuration from `~/.config/controller-cli/config.toml`:

```toml
[session]
storage_path = "~/.config/cartridge"
default_chain_id = "SN_SEPOLIA"
default_rpc_url = "https://api.cartridge.gg/x/starknet/sepolia"

[cli]
json_output = false
use_colors = true
callback_timeout_seconds = 300
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

When using `--json`, errors return structured responses with machine-readable codes and recovery hints:

```json
{
  "status": "error",
  "error_code": "SessionExpired",
  "message": "Session expired at 2025-01-01 00:00:00 UTC",
  "recovery_hint": "Run 'controller register-session' to create a new session"
}
```

| Error Code | Meaning | Fix |
|------------|---------|-----|
| `NoSession` | No keypair found | Run `generate-keypair` |
| `SessionExpired` | Session has expired | Run `register-session` again |
| `InvalidSessionData` | Corrupted session data | Run `clear` and start over |
| `TransactionFailed` | Execution failed | Check policies and calldata |
| `CallbackTimeout` | Authorization timed out | Run `register-session` again |

## Source

[github.com/cartridge-gg/controller-cli](https://github.com/cartridge-gg/controller-cli)
