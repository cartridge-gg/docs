---
description: Learn how to manage billing for Slot services through team-based credit management.
title: Billing
---

# Billing

All billing in Slot is managed through teams. Teams are the billing entity that owns credits, which are used to pay for deployments, paymasters, RPC requests, and other Slot services.

## Overview

Slot uses a prepaid credit system where:
- All costs are charged to a **team's credit balance**
- Teams can be funded via credit card or cryptocurrency
- Credits are deducted automatically as you use services
- You can monitor spending through invoices and team balance

## Setting Up Billing

### 1. Create a Team

First, create a team with an email address for billing notifications:

```sh
slot teams <team-name> create --email <your-email@example.com> [--address "your address"] [--tax-id "abc123"]
```

**Example:**
```sh
slot teams my-game create --email developer@mygame.com --address "123 Main St, City, Country" --tax-id "TAX123456"
```

:::info
If you create a deployment before creating a team explicitly, a team with the same name as your project will be created automatically.
:::

### 2. Fund Your Team

To add credits to your team, use the `slot auth fund` command which opens a browser interface:

```sh
slot auth fund
```

This will:
1. Open your browser to the funding interface
2. Display a list of your teams
3. Allow you to select the team you want to fund
4. Provide payment options (credit card or crypto)
5. Complete the purchase and add credits to the selected team

**Web Interface:**
You can also navigate directly to `https://x.cartridge.gg/slot/fund` to fund teams through the web interface.

## Managing Teams

### Update Team Information

Update the billing email, address, or tax ID for an existing team:

```sh
slot teams <team-name> update [--email <new-email@example.com>] [--address "your address"] [--tax-id "abc123"]
```

### Check Team Balance

View your team's current credit balance and information:

```sh
slot teams <team-name> info
```

### View Invoices

Check billing history and invoices for your team:

```sh
slot teams <team-name> invoices
```

This command displays:
- Past billing periods
- Credits consumed
- Services used
- Total charges

### Team Collaborators

Add or remove team members who can manage the team's resources:

```sh
# List current team members
slot teams <team-name> list

# Add a collaborator
slot teams <team-name> add <username>

# Remove a collaborator
slot teams <team-name> remove <username>
```

:::info
The username is the Cartridge Controller username used to login.
:::

## What Uses Credits?

Credits are consumed by various Slot services:

### Deployments
- **Basic tier**: $10/month (first 3 are free)
- **Pro tier**: $50/month (2 vCPU, 4GB RAM)
- **Epic tier**: $100/month (4 vCPU, 8GB RAM)
- **Legendary tier**: $200/month (8 vCPU, 16GB RAM)
- **Storage**: $0.20/GB/month (auto-scaling for premium tiers)
- Billed daily with minimum 1-day charge

### Paymasters
- Transaction fees are deducted from the paymaster's budget
- Paymaster budgets are funded from team credits
- 1 CREDIT = $0.01 USD

### RPC Requests
- Free tier: 1M requests/month
- Additional requests: $5 per 1M requests
- Charged to the team associated with your RPC endpoint

### Multi-Region Deployments
- Cost multiplied by number of regions × replicas
- Example: 2 replicas in 3 regions = 6× base tier cost

## Billing Cycle

Slot uses a **daily billing model**:
- Charges are calculated and deducted daily
- Minimum charge period is 1 day
- If you delete a resource after 1 hour, you're still charged for the full day
- Credits are deducted automatically from your team balance

## Best Practices

### Monitor Your Spending
- Regularly check `slot teams <team-name> info` to view credit balance
- Review invoices monthly with `slot teams <team-name> invoices`
- Set up email notifications by ensuring your team has a valid email

### Keep Sufficient Balance
- Maintain adequate credits to avoid service interruptions
- Premium tier deployments (Pro and above) remain active as long as the team has credits
- Basic tier deployments are auto-scaled down after inactivity but won't be deleted if funded

### Team Organization
- Use separate teams for different projects or environments
- Add billing email to receive low-balance alerts
- Limit team membership to necessary collaborators

## Troubleshooting

### Insufficient Credits Error

If you encounter insufficient credits when creating services:

```sh
# Check your team's current balance
slot teams <team-name> info

# Fund the team
slot auth fund

# Retry your operation
```

### Service Not Starting

If a premium tier deployment isn't starting:
- Verify team has sufficient credits with `slot teams <team-name> info`
- Ensure the service was created with `--team <team-name>` flag
- Check that you're a member of the team

### Invoice Questions

For billing inquiries or invoice details:
- Review `slot teams <team-name> invoices` for detailed history
- Contact support through Discord if you have questions about charges
- Ensure your team email is up-to-date for billing communications

## Related Documentation

- [Scale](/slot/scale) - Learn about deployment tiers and pricing
- [Paymaster](/slot/paymaster) - Manage paymaster budgets and policies
- [RPC](/slot/rpc) - Understand RPC pricing and free tiers
