---
showOutline: 1
description: Get started with Slot, the execution layer of Dojo that provides low latency, dedicated, provable execution contexts for blockchain applications.
title: Slot Getting Started
---

# Getting Started

Slot is the execution layer of Dojo, supporting rapid provisioning of low latency, dedicated, provable execution contexts, bringing horizontal scalability to the blockchain. It manages the sequencing, proving, and efficient settlement of its execution.

## Installation

Install slotup to manage slot installations and follow the outputted directions.

```sh
curl -L https://slot.cartridge.sh | bash
```

## Usage

Authenticate with Cartridge

```sh
slot auth login
```

## Programmatic usage

First, authenticate as mentioned above. Then, run:

```sh
slot auth token
```

Follow instructions and save the output to set the SLOT_AUTH env var.
You can set this environment variable in CI, scripts, or deployment platforms to run slot without having to login.

### Create service deployments

```sh
slot deployments create <Project Name> katana
slot deployments create <Project Name> torii --config <path/to/torii.toml>
```

Torii requires a TOML configuration file.
A minimal config specifies the RPC endpoint and world address:

```toml
# torii.toml
rpc = "https://api.cartridge.gg/x/starknet/mainnet"
world_address = "0x3fa481f41522b90b3684ecfab7650c259a76387fab9c380b7a959e3d4ac69f"
```

The config file also supports additional indexing and event options:

```toml
[indexing]
allowed_origins = ["*"]
index_pending = true
index_transactions = false
polling_interval = 1000
contracts = [
  "erc20:<contract-address>",
  "erc721:<contract-address>"
]

[events]
raw = true
historical = ["namespace-EventName"]
```

:::info
When you create a service with a project name that didn't exist before, a new team is automatically created.
:::

### Update a service

```sh
slot deployments update <Project Name> torii --version v1.0.0
slot deployments update <Project Name> torii --config <path/to/torii.toml>
slot deployments update <Project Name> torii --replicas 3
```

### Delete a service

```sh
slot deployments delete <Project Name> torii
```

### Transfer a service to another team

```sh
slot d transfer <Project Name> <katana | torii> <To Team Name>
```

### Read service logs

```sh
slot deployments logs <Project Name> <katana | torii>
```

### List all deployments

```sh
slot deployments list
```

### View deployments configuration

```sh
slot deployments describe <Project Name> <katana | torii>
```

### View predeployed accounts

```sh
slot deployments accounts <Project Name> katana
```

### Manage collaborators with teams

The name of the team is the same as the project name used to create a service. A team is automatically created when you create a new project.

```sh
slot teams <Team Name> list
slot teams <Team Name> add <Account Name>
slot teams <Team Name> remove <Account Name>
```

:::info
The account name can also be called controller username. The one used to login on controller.
:::

## Billing

Teams need credits to run paid services and paymasters. See the [Billing](/slot/billing) documentation for information on funding teams and managing credits.
