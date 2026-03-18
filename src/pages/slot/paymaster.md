---
showOutline: 1
description: Manage Slot paymasters to sponsor transaction fees for your applications.
title: Paymaster Management
---

# Paymaster Management

Paymasters in Slot allow you to sponsor transaction fees for your applications, enabling gasless experiences for your users. The Cartridge Paymaster is a powerful feature that enables gasless transactions for your users, creating a more seamless Web3 experience. When enabled, the paymaster automatically covers transaction fees on behalf of your users, eliminating the need for them to hold ETH / STRK for gas fees. You can manage budgets, policies, and monitor usage through the Slot CLI.

## Availability

The paymaster service is available across all networks with different activation requirements:

- **Testnet Networks**
  - Automatically enabled, no additional setup required

- **Mainnet**
  - Available and fully self-served
  - Manage everything through the Slot CLI
  - Define your own usage scopes and spending limits

## Integration

One of the key benefits of the Cartridge Paymaster is that it requires zero additional integration work. When the paymaster is enabled for your application, it will automatically activate for all eligible transactions. No code changes or configuration are needed.

## Prerequisites

Make sure you are authenticated with Slot. For complete authentication setup, see [Getting Started](/slot/getting-started):

```bash
slot auth login
```

## Team Setup

Before creating a paymaster, you need a team with sufficient credits. See the [Billing](/slot/billing) documentation for detailed information on setting up teams and funding.

## Creating a Paymaster

Create a new paymaster with an initial budget:

```bash
slot paymaster <paymaster-name> create --team <team-name> --budget <amount> --unit CREDIT
```

### Example

```bash
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

```bash
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

```bash
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

### Understanding Paymaster Predicates

Paymaster policies now support **predicates** - conditional logic that determines whether a transaction should be sponsored. This enables sophisticated sponsorship rules based on game state, user eligibility, or other custom conditions.

**How Predicates Work:**
1. When a transaction is submitted to a paymaster with a predicate-enabled policy
2. The paymaster first calls the predicate contract function
3. If the predicate returns `true`, the transaction is sponsored
4. If the predicate returns `false` or reverts, the transaction is not sponsored

**Use Cases:**
- Sponsor moves only for players with sufficient in-game energy
- Sponsor attacks only during specific game phases
- Sponsor crafting only for players with required materials
- Rate-limit sponsorship per user or per game session

:::tip
Predicates are optional. Policies without predicates will always sponsor matching transactions, while policies with predicates add conditional logic.
:::

### vRNG Integration

Paymasters can sponsor vRNG operations, providing gasless random number generation for your games. When configuring policies for vRNG-enabled contracts, the paymaster will automatically handle both the initial request and callback transactions. For detailed vRNG setup and usage, see [vRNG](/slot/vrng).

### Add Policies from Preset (Recommended)

The preferred way to add policies is using verified contract presets for your games:

```bash
slot paymaster <paymaster-name> policy add-from-preset --name <preset-name>
```

**Example:**
```bash
slot paymaster my-game-pm policy add-from-preset --name dope-wars
```

:::info
Presets contain verified contracts from games in the Dojo ecosystem. Make sure to add your contracts to the preset repository first at [https://github.com/cartridge-gg/presets/tree/main/configs](https://github.com/cartridge-gg/presets/tree/main/configs) before using this method.
:::

### Add a Single Policy

For individual contract policies or custom contracts not yet in presets:

```bash
slot paymaster <paymaster-name> policy add --contract <contract-address> --entrypoint <entry-point>
```

### Add Policies from JSON File

For bulk adding multiple custom policies:

```bash
slot paymaster <paymaster-name> policy add-from-json --file <path-to-json>
```

**JSON Format:**
```json
[
  {
    "contractAddress": "0x1234...abcd",
    "entrypoint": "move_player"
  },
  {
    "contractAddress": "0x5678...efgh",
    "entrypoint": "attack",
    "predicate": {
      "address": "0x9abc...1234",
      "entrypoint": "check_attack_eligibility"
    }
  }
]
```

:::info
**Predicate Support**: You can include optional `predicate` objects in your policy JSON to add conditional logic for transaction sponsorship. The predicate must contain an `address` (contract address) and `entrypoint` (function name) that will be called to evaluate whether the transaction should be sponsored.
:::

### Remove a Policy

```bash
slot paymaster <paymaster-name> policy remove --contract <contract-address> --entrypoint <entry-point>
```

**Output:**
```
Successfully removed policy: PolicyArgs { contract: "0x1234...abcd", entrypoint: "move_player" }
```

### Remove All Policies

```bash
slot paymaster <paymaster-name> policy remove-all
```

:::warning
This action requires confirmation and cannot be undone.
:::

### List Policies

```bash
slot paymaster <paymaster-name> policy list
```

## Paymaster Information

Get comprehensive information about your paymaster:

```bash
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
  • Total: 9000 CREDIT ($90.00 USD)
  • Spent: 1759.56 CREDIT ($17.60 USD)
  • Usage: [█████░░░░░░░░░░░░░░░░░░░░░░░░░] 19.7%

📋 Policies:
  • Count: 3
```

## Updating Paymaster Configuration

Update your paymaster's basic configuration settings:

```bash
slot paymaster <current-name> update [OPTIONS]
```

### Update Paymaster Name

```bash
slot paymaster my-game-pm update --name new-game-pm
```

### Change Team Association

Transfer the paymaster to a different team:

```bash
slot paymaster my-game-pm update --team new-team
```

### Enable/Disable Paymaster

Toggle the active state of your paymaster:

```bash
# Disable paymaster (stops sponsoring transactions)
slot paymaster my-game-pm update --active false

# Re-enable paymaster
slot paymaster my-game-pm update --active true
```

:::warning
- Changing the team association will transfer the paymaster and its budget to the new team
- Disabling a paymaster will immediately stop it from sponsoring new transactions
- At least one update parameter (--name, --team, or --active) must be provided
:::

## Statistics and Monitoring

View usage statistics for your paymaster:

```bash
slot paymaster <paymaster-name> stats --last <time-period>
```

**Example:**
```bash
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

## Transaction History

View detailed transaction history for your paymaster with filtering and sorting options:

```bash
slot paymaster <paymaster-name> transactions [OPTIONS]
```

### Basic Usage

View recent transactions:

```bash
slot paymaster my-game-pm transactions
```

**Output:**
```
📊 Paymaster Transactions for 'my-game-pm' (Last 24hr)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Transaction Hash                                                   Executed     Status       USD Fee
──────────────────────────────────────────────────────────────────────────────────────────────────────────────
0x50c2dd556593564fe2b814d61b3b1592682de83702552a993d24f9e897710e7  11s ago      SUCCESS      $0.0026
0x41b0f547741bd1fdc29dd4c82a80da2a452314e710ae7cbe0e05cb4cb1e6c0e  22s ago      SUCCESS      $0.0025
0x4b74ee2ab7764cb3d11f3319b64c2698b868727fdf99728bdf74aa023b5e77d  32s ago      REVERTED     $0.0028
0x2af69b9798355e91119c6a9adb1363b2f533f0557601e4687dcfe9725e8feaa  42s ago      SUCCESS      $0.0025
0x25dfc115dabda89a2027366790ee5cfcfefb861fe1b584c6fb15dc1588e0816  47s ago      REVERTED     $0.0032
```

### Filtering Options

**Filter by Status:**
```bash
# Show only successful transactions
slot paymaster my-game-pm transactions --filter SUCCESS

# Show only reverted transactions
slot paymaster my-game-pm transactions --filter REVERTED

# Show all transactions (default)
slot paymaster my-game-pm transactions --filter ALL
```

**Time Period:**
```bash
# Last hour
slot paymaster my-game-pm transactions --last 1hr
```

**Sorting:**
```bash
# Sort by fees (ascending)
slot paymaster my-game-pm transactions --order-by FEES_ASC

# Sort by fees (descending)
slot paymaster my-game-pm transactions --order-by FEES_DESC

# Sort by execution time (most recent first - default)
slot paymaster my-game-pm transactions --order-by EXECUTED_AT_DESC

# Sort by execution time (oldest first)
slot paymaster my-game-pm transactions --order-by EXECUTED_AT_ASC
```

**Limit Results:**
```bash
# Show up to 50 transactions (max 1000)
slot paymaster my-game-pm transactions --limit 50
```

## Dune Analytics Queries

Generate Dune Analytics queries to analyze your paymaster's transaction data:

```bash
slot paymaster <paymaster-name> dune [OPTIONS]
```

### Example Dashboard
See a live example of paymaster analytics at [Blob Arena Stats](https://dune.com/cartridge/blob-arena) on Dune Analytics.

### Basic Usage

Generate a comprehensive SQL query for your paymaster:

```bash
slot paymaster my-game-pm dune
```

The query provides exhaustive analysis including:
- Finds all execute_from_outside_v3 selectors in transaction calldata
- Handles both normal calls and multi-call vRNG helpers
- Matches all patterns including nested vRNG calls
- Comprehensive metrics with daily, weekly, and monthly breakdowns

### Time Period Options

By default, queries use the paymaster's creation time. You can specify a custom time period:

```bash
# Last 24 hours
slot paymaster my-game-pm dune --last 24hr

# Last week
slot paymaster my-game-pm dune --last 1week
```

**Time Period Options:**
- `1hr`, `2hr`, `24hr`
- `1day`, `2day`, `7day`
- `1week`

### Dune Template Parameters

For dynamic queries in Dune dashboards, use template parameters:

```bash
slot paymaster my-game-pm dune --dune-params
```

This generates a query with `{{start_time}}` and `{{end_time}}` parameters that you can configure in your Dune dashboard.

### Query Output

The command generates a comprehensive SQL query that includes:

**Daily Metrics:**
- Transaction counts and unique users
- New vs returning users
- Fees in STRK and USD
- Transactions per user ratio

**Rolling Windows:**
- 7-day active users (WAU)
- 30-day active users (MAU)

**Aggregated Views:**
- Weekly and monthly summaries
- Overall totals and averages
- User acquisition and retention metrics

### Usage Tips

**For Dashboard Creation:**
- Use `--dune-params` for interactive dashboards
- Copy the generated SQL directly into Dune Analytics
- Set up time range parameters for flexible analysis

**For One-time Analysis:**
- Specify `--last` with appropriate time period
- Query will include actual timestamps for immediate execution

:::tip
The query is optimized for comprehensive analysis but may timeout on very long time ranges. For historical analysis spanning months, consider breaking it into smaller time periods or using Dune's incremental refresh features.
:::

### Common Use Cases

**Growth Analysis:**
```bash
slot paymaster my-game-pm dune --last 1week
```
Analyze weekly growth trends, user acquisition, and engagement patterns.

**Daily Monitoring:**
```bash  
slot paymaster my-game-pm dune --last 24hr
```
Monitor recent activity, transaction success rates, and costs.

**Dashboard Setup:**
```bash
slot paymaster my-game-pm dune --dune-params
```
Create flexible dashboards with configurable time ranges.

### Quick Debugging Use Cases

The transaction history is useful for identifying issues:

**View expensive transactions that might indicate inefficient contract calls:**
```bash
slot paymaster my-game-pm transactions --order-by FEES_DESC --limit 10
```

**Investigate failed transactions to debug contract issues:**
```bash
slot paymaster my-game-pm transactions --filter REVERTED --last 24hr
```

## Best Practices

### Budget Management
- Start with a conservative budget and increase as needed
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
```bash
# Set up billing first (see /slot/billing for details)
# Then create paymaster
slot paymaster my-game-pm create --team my-team --budget 1000 --unit CREDIT

# Add game contract policies
slot paymaster my-game-pm policy add --contract 0x123...abc --entrypoint move_player
slot paymaster my-game-pm policy add --contract 0x123...abc --entrypoint attack_enemy
slot paymaster my-game-pm policy add --contract 0x123...abc --entrypoint use_item

# Check initial setup
slot paymaster my-game-pm info
```

### Monitoring and maintenance
```bash
# Check daily stats
slot paymaster my-game-pm stats --last 24hr

# Check current status
slot paymaster my-game-pm info

# Add more budget if needed (ensure team has credits)
slot paymaster my-game-pm budget increase --amount 500 --unit CREDIT
```

### Insufficient Credits Error
If you encounter insufficient credits when creating or funding a paymaster, see the [Billing](/slot/billing) documentation for information on funding your team.
