---
description: Manage Slot paymasters to sponsor transaction fees for your applications using Credits.
title: Paymaster Management
---

# Paymaster Management

Paymasters in Slot allow you to sponsor transaction fees for your applications, enabling gasless experiences for your users. You can manage budgets, policies, and monitor usage through the Slot CLI.

## Prerequisites

Make sure you are authenticated with Slot:

```sh
slot auth login
```

## Team Setup

Before creating a paymaster, you need a team with sufficient credits.

### Create a Team (if it doesn't exist)

```sh
slot teams <team-name> create --email <your-email@example.com>
```

### Fund Your Account and Transfer to Team

Paymasters automatically deduct from your team's account balance when created. If you don't have sufficient credits:

```sh
# Buy credits for your account (opens browser)
slot auth fund

# Transfer credits to your team 
slot auth transfer <team-name> --credits <amount>
```


## Creating a Paymaster

Create a new paymaster with an initial budget:

```sh
slot paymaster <paymaster-name> create --team <team-name> --budget <amount> --unit CREDIT
```

### Example

```sh
slot paymaster my-game-pm create --team my-team --budget 1000 --unit CREDIT
```

**Output:**
```
✅ Paymaster Created Successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Details:
  • Name: my-game-pm
  • Team: my-team

💰 Initial Budget:
  • Amount: 1000 CREDIT ($10.00 USD)
```

:::info
The initial budget amount will be automatically deducted from your team's account balance. Make sure your team has sufficient credits before creating a paymaster.
:::

## Managing Budget

### Increase Budget

Add funds to your paymaster:

```sh
slot paymaster <paymaster-name> budget increase --amount <amount> --unit CREDIT
```

**Output:**
```
✅ Budget Increased Successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Paymaster: my-game-pm

📈 Operation:
  • Action: Increased
  • Amount: 500 CREDIT

💰 New Budget:
  • Amount: 1500 CREDIT ($15.00 USD)
```

### Decrease Budget

Remove funds from your paymaster:

```sh
slot paymaster <paymaster-name> budget decrease --amount <amount> --unit CREDIT
```

**Output:**
```
✅ Budget Decreased Successfully
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Paymaster: my-game-pm

📉 Operation:
  • Action: Decreased
  • Amount: 200 CREDIT

💰 New Budget:
  • Amount: 1300 CREDIT ($13.00 USD)
```

## Policy Management

Policies define which contracts and entry points your paymaster will sponsor.

### Add Policies from Preset (Recommended)

The preferred way to add policies is using verified contract presets for your games:

```sh
slot paymaster <paymaster-name> policy add-from-preset --name <preset-name>
```

**Example:**
```sh
slot paymaster my-game-pm policy add-from-preset --name dope-wars
```

:::info
Presets contain verified contracts from games in the Dojo ecosystem. Make sure to add your contracts to the preset repository first at [https://github.com/cartridge-gg/presets/tree/main/configs](https://github.com/cartridge-gg/presets/tree/main/configs) before using this method.
:::

### Add a Single Policy

For individual contract policies or custom contracts not yet in presets:

```sh
slot paymaster <paymaster-name> policy add --contract <contract-address> --entrypoint <entry-point>
```

### Add Policies from JSON File

For bulk adding multiple custom policies:

```sh
slot paymaster <paymaster-name> policy add-from-json --file <path-to-json>
```

**JSON Format:**
```json
[
  {
    "contractAddress": "0x1234...abcd",
    "entryPoint": "move_player"
  },
  {
    "contractAddress": "0x5678...efgh",
    "entryPoint": "attack"
  }
]
```

### Remove a Policy

```sh
slot paymaster <paymaster-name> policy remove --contract <contract-address> --entrypoint <entry-point>
```

**Output:**
```
Successfully removed policy: PolicyArgs { contract: "0x1234...abcd", entrypoint: "move_player" }
```

### Remove All Policies

```sh
slot paymaster <paymaster-name> policy remove-all
```

:::warning
This action requires confirmation and cannot be undone.
:::

### List Policies

```sh
slot paymaster <paymaster-name> policy list
```

## Paymaster Information

Get comprehensive information about your paymaster:

```sh
slot paymaster <paymaster-name> info
```

**Output:**
```
🔍 Paymaster Info for 'my-game-pm'
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🏢 Details:
  • Team: my-team
  • Active: ✅ Yes

💰 Budget:
  • Amount: 1300 CREDIT ($13.00 USD)
  • Total Spent: 45.25 CREDIT

📋 Policies:
  • Count: 3
```

## Statistics and Monitoring

View usage statistics for your paymaster:

```sh
slot paymaster <paymaster-name> stats --last <time-period>
```

**Example:**
```sh
slot paymaster my-game-pm stats --last 24hr
```

**Time Period Options:**
- `1hr`, `2hr`, `24hr`
- `1day`, `2day`, `7day`
- `1week`

**Output:**
```
📊 Paymaster Stats for 'my-game-pm' (Last 24hr)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📈 Transactions:
  • Total: 1,247
  • Successful: 1,198
  • Reverted: 49
  • Success Rate: 96.1%

💰 Fees (USD):
  • Total (24hr): $12.45
  • Average: $0.009988
  • Minimum: $0.001234
  • Maximum: $0.045678

👥 Users:
  • Unique Users: 89
```

## Best Practices

### Budget Management
- Monitor spending through the stats command
- Keep sufficient team balance for paymaster operations

### Policy Management
- Be specific with your policies to avoid sponsoring unintended transactions
- **Use presets whenever possible** for verified game contracts in the Dojo ecosystem
- Contribute your game contracts to the preset repository for community verification
- Regularly review and update policies as your application evolves
- Test policies with small budgets before scaling up

### Security
- Only add policies for contracts you trust
- Keep your team membership limited to necessary collaborators

## Common Workflows

### Setting up a new game paymaster
```sh
# Create team if it doesn't exist
slot teams my-team create --email developer@mygame.com

# Fund your account and transfer to team
slot auth fund
slot auth transfer my-team --credit 100

# Create paymaster
slot paymaster my-game-pm create --team my-team --budget 1000 --unit CREDIT

# Add game contract policies
slot paymaster my-game-pm policy add --contract 0x123...abc --entrypoint move_player
slot paymaster my-game-pm policy add --contract 0x123...abc --entrypoint attack_enemy
slot paymaster my-game-pm policy add --contract 0x123...abc --entrypoint use_item

# Check initial setup
slot paymaster my-game-pm info
```

### Monitoring and maintenance
```sh
# Check daily stats
slot paymaster my-game-pm stats --last 24hr

# Check current status
slot paymaster my-game-pm info

# Add more budget if needed (ensure team has credits)
slot paymaster my-game-pm budget increase --amount 500 --unit CREDIT
```

### Insufficient Credits Error
If you encounter insufficient credits when creating or funding a paymaster:

```sh
# Check team balance first
slot teams my-team info

# Fund your account if needed
slot auth fund

# Transfer more credits to team
slot auth transfer my-team --credit 50

# Retry your paymaster operation
slot paymaster my-game-pm create --team my-team --budget 1000 --unit CREDIT
``` 