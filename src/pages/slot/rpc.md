---
showOutline: 1
description: Cartridge RPC endpoints for Starknet mainnet and Sepolia testnet with authentication and CORS configuration.
title: Cartridge RPC
---

# Cartridge RPC

Cartridge provides dedicated RPC endpoints for Starknet networks with built-in authentication and CORS support.

## Pricing

Cartridge RPC is free for up to 1m requests per month. Additional requests are charged at $5/1m requests to the related slot team.

:::info
During the beta phase, Cartridge RPC is free. From November 1st 2025, pricing will be applied.
:::

## Endpoints

### Mainnet
```
https://api.cartridge.gg/x/starknet/mainnet
```

### Sepolia Testnet
```
https://api.cartridge.gg/x/starknet/sepolia
```

## Authentication

Cartridge RPC supports two authentication methods:

### API Token Authentication

Authenticate requests using an API token with the `Authorization` header:

```bash
curl https://api.cartridge.gg/x/starknet/mainnet \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "starknet_chainId",
    "params": [],
    "id": 1
  }'
```

### Domain Whitelisting

For browser-based applications, whitelist your domains to make direct RPC calls without exposing API tokens. Once configured, your whitelisted domains can make requests directly:

```javascript
const response = await fetch('https://api.cartridge.gg/x/starknet/mainnet', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    jsonrpc: '2.0',
    method: 'starknet_chainId',
    params: [],
    id: 1,
  }),
});
```

:::info
Requests from whitelisted domains without an API token are rate limited per IP address.
:::

## Setup with Slot CLI

### Prerequisites

Authenticate with Cartridge:

```bash
slot auth login
```

### Managing API Tokens

Create a new RPC API token:

```bash
slot rpc tokens create <KEY_NAME> --team <TEAM_NAME>
```

List all RPC API tokens:

```bash
slot rpc tokens list --team <TEAM_NAME>
```

Delete an RPC API token:

```bash
slot rpc tokens delete <KEY_ID> --team <TEAM_NAME>
```

### Managing CORS Whitelist

Domain whitelists are always specified as root domains, all subdomains are automatically included.

Add a domain to the CORS whitelist:

```bash
slot rpc whitelist add <DOMAIN> --team <TEAM_NAME>
```

Examples:
```bash
# Whitelist a specific domain
slot rpc whitelist add example.com --team my-team
```

List all whitelisted domains:

```bash
slot rpc whitelist list --team <TEAM_NAME>
```

Remove a domain from the CORS whitelist:

```bash
slot rpc whitelist remove <ENTRY_ID> --team <TEAM_NAME>
```

### Viewing RPC Logs

View RPC request logs for your team:

```bash
slot rpc logs --team <TEAM_NAME>
```

#### Options

- `--after <CURSOR>`: Fetch logs after a specific cursor for pagination
- `--limit <NUMBER>`: Limit the number of log entries returned (default: 100)
- `--since <DURATION>`: Fetch logs from a specific time period (e.g., `30m`, `1h`, `24h`)

#### Examples

```bash
# View the last 5 log entries from the past 30 minutes
slot rpc logs --team my-team --limit 5 --since 30m

# Paginate through logs using a cursor
slot rpc logs --team my-team --after gaFpuWNtaDVhZ3k2Nzc2c2gwMWR4N3FsYXlhc2s --limit 5

# View recent logs with time filter
slot rpc logs --team my-team --since 1h
```
