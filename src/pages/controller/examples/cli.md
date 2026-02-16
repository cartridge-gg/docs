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

### 1. Define policies

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

### 2. Authorize a session

Using a policy file:

```bash
controller session auth --file policies.json --chain-id SN_MAIN
```

Or use a preset for popular games/apps:

```bash
controller session auth --preset loot-survivor --chain-id SN_MAIN
```

Available presets include: `loot-survivor`, `influence`, `realms`, `pistols`, `dope-wars`, and more.

This generates a new keypair, creates an authorization URL, and automatically polls until you approve in the browser. Session credentials are stored once authorized.

### 3. Execute transactions

**Single call (positional args):**

```bash
controller execute \
  0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 \
  transfer \
  0x1234,u256:1000000000000000000
```

**Multiple calls from a file:**

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

Transactions are auto-subsidized via paymaster when possible. Use `--no-paymaster` to pay with user funds directly.

### 4. Read-only calls

```bash
controller call \
  0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 \
  balance_of \
  0xaddress
```

Use `--block-id` to query at a specific block (`latest`, `pending`, a block number, or block hash).

### Calldata formats

Calldata values support multiple formats:

| Format | Example | Description |
|--------|---------|-------------|
| Hex | `0x64` | Standard hex felt |
| Decimal | `100` | Decimal felt |
| `u256:` | `u256:1000000000000000000` | Auto-splits into low/high 128-bit felts |
| `str:` | `str:hello` | Cairo short string |

The `u256:` prefix eliminates the need to manually split token amounts into low/high parts.

## Commands

### `session auth`

Generates a keypair, creates an authorization URL, and waits for the user to approve in the browser.

```bash
# Using a policy file
controller session auth --file <policy_file> --chain-id SN_MAIN

# Using a preset
controller session auth --preset <preset_name> --chain-id SN_MAIN
```

**Presets:** Popular games/apps have pre-defined policies:
- `loot-survivor` — Loot Survivor game
- `influence` — Influence space strategy
- `realms` — Realms world
- `pistols` — Pistols at Dawn
- `dope-wars` — Dope Wars

See all presets at [github.com/cartridge-gg/presets](https://github.com/cartridge-gg/presets/tree/main/configs).

### `session status`

Displays current session status, keypair info, and expiration details.

```bash
controller session status
```

Returns one of three states: `no_session`, `keypair_only`, or `active`.

### `session list`

Lists all active sessions with pagination.

```bash
controller session list
controller session list --limit 20 --page 2
```

### `session clear`

Removes all stored session data and keypairs.

```bash
controller session clear [--yes]
```

### `execute`

Executes a transaction using the active session.

```bash
# Single call (positional: contract entrypoint calldata)
controller execute <address> <entrypoint> <calldata> [--chain-id <id>] [--no-paymaster] [--wait] [--timeout <seconds>]

# Multiple calls from file
controller execute --file <calls.json> [--chain-id <id>] [--no-paymaster] [--wait] [--timeout <seconds>]
```

| Flag | Description | Default |
|------|-------------|---------|
| `--chain-id` | Chain ID (`SN_MAIN`, `SN_SEPOLIA`) | From config |
| `--no-paymaster` | Bypass paymaster, pay fees directly | off |
| `--wait` | Wait for transaction confirmation | off |
| `--timeout` | Confirmation timeout in seconds | 300 |

### `call`

Performs a read-only contract call (no transaction).

```bash
controller call <address> <entrypoint> [calldata] [--block-id <id>] [--chain-id <id>]
```

### `transaction`

Gets the status of a transaction.

```bash
controller transaction <tx_hash> --chain-id SN_SEPOLIA
```

Add `--wait` to poll until the transaction reaches a final status.

### `receipt`

Gets the full receipt of a transaction including execution status, fees, events, and messages.

```bash
controller receipt <tx_hash> --chain-id SN_SEPOLIA
```

Add `--wait` to poll until the receipt is available.

### `balance`

Queries ERC20 token balances for the active session account.

```bash
# All known token balances
controller balance

# Specific token
controller balance eth
```

Built-in tokens: ETH, STRK, USDC, USD.e, LORDS, SURVIVOR, WBTC. Custom tokens can be added via `config set token.<SYMBOL> <address>`.

### `username`

Displays the Cartridge username associated with the active session account.

```bash
controller username
```

### `lookup`

Resolves Cartridge controller usernames to addresses or vice versa.

```bash
# Look up addresses for usernames
controller lookup --usernames shinobi,sensei

# Look up usernames for addresses
controller lookup --addresses 0x123...,0x456...
```

Output format: `username:address` pairs.

### `config`

Manages CLI configuration values.

```bash
# Set a config value
controller config set rpc-url https://api.cartridge.gg/x/starknet/mainnet

# Get a config value
controller config get rpc-url

# List all config values
controller config list

# Add a custom token for balance tracking
controller config set token.MYTOKEN 0x123...
```

Valid keys: `rpc-url`, `keychain-url`, `api-url`, `storage-path`, `json-output`, `colors`, `callback-timeout`, `token.<symbol>`.

## Global Flags

All commands support:

| Flag | Description |
|------|-------------|
| `--json` | Machine-readable JSON output |
| `--no-color` | Disable colored terminal output |

## Network Selection

Specify the network using `--chain-id` or configure a default RPC URL:

| Chain ID | RPC URL | Usage |
|----------|---------|-------|
| `SN_MAIN` | `https://api.cartridge.gg/x/starknet/mainnet` | Starknet Mainnet |
| `SN_SEPOLIA` | `https://api.cartridge.gg/x/starknet/sepolia` | Starknet Sepolia |

RPC URL precedence: `--chain-id` flag > config `rpc-url` > environment variable.

## Paymaster Control

By default, transactions use the paymaster (free execution). If the paymaster is unavailable, the transaction **fails** rather than falling back to user-funded execution.

Use `--no-paymaster` to bypass the paymaster and pay with user funds:

```bash
controller execute \
  0x49d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7 \
  transfer \
  0x1234,u256:1000000000000000000 \
  --no-paymaster
```

## Configuration

The CLI reads configuration from `~/.config/controller-cli/config.toml`:

```toml
[session]
storage_path = "~/.config/controller-cli"
rpc_url = "https://api.cartridge.gg/x/starknet/sepolia"
keychain_url = "https://x.cartridge.gg"
api_url = "https://api.cartridge.gg/query"

[cli]
json_output = false
use_colors = true
callback_timeout_seconds = 300

[tokens]
MYTOKEN = "0x123..."
```

Settings can also be managed with `controller config set/get/list`, or overridden with environment variables:

| Variable | Description |
|----------|-------------|
| `CARTRIDGE_STORAGE_PATH` | Session storage location |
| `CARTRIDGE_RPC_URL` | Default RPC endpoint |
| `CARTRIDGE_JSON_OUTPUT` | Default to JSON output (`true`/`1`) |

Precedence: CLI flags > environment variables > config file.

## Error Handling

Common errors and how to fix them:

| Error | Meaning | Fix |
|-------|---------|-----|
| `NoSession` | No keypair found | Run `session auth` |
| `SessionExpired` | Session has expired | Run `session auth` again |
| `InvalidSessionData` | Corrupted session data | Run `session clear` and start over |
| `TransactionFailed` | Execution failed | Check policies and calldata |
| `CallbackTimeout` | Authorization timed out | Run `session auth` again |
| `ManualExecutionRequired` | No authorized session for this transaction | Register session with appropriate policies |
| `InvalidInput` | Invalid input parameters | Check command syntax and calldata |

When using `--json`, errors return structured responses with machine-readable codes and recovery hints:

```json
{
  "status": "error",
  "error_code": "SessionExpired",
  "message": "Session expired at 2025-01-01 00:00:00 UTC",
  "recovery_hint": "Run 'controller session auth' to create a new session"
}
```

## AI Agent Integration

For AI agents and LLMs integrating with the CLI, see the [LLM Usage Guide](https://github.com/cartridge-gg/controller-cli/blob/main/LLM_USAGE.md) in the repository for detailed integration patterns and best practices.

## Source

[github.com/cartridge-gg/controller-cli](https://github.com/cartridge-gg/controller-cli)
