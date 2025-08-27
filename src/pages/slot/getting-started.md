---
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
slot deployments create <Project Name> torii --world 0x3fa481f41522b90b3684ecfab7650c259a76387fab9c380b7a959e3d4ac69f
```

:::info
When you create a service with a project name that didn't exist before, a new team is automatically created.
:::

### Update a service

```sh
slot deployments update <Project Name> torii --version v0.3.5
```

### Delete a service

```sh
slot deployments delete <Project Name> torii
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

### Fund teams

Teams need credits to run services and paymasters. You can fund teams using CLI commands or the web interface:

**CLI:**
```sh
slot auth fund
```

**Web Interface:**
Navigate to `https://x.cartridge.gg/slot/fund` to fund teams through a user-friendly interface with credit card or crypto payments.
