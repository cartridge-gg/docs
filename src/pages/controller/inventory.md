---
description: Learn how to use and configure the Cartridge Controller's Inventory modal for managing ERC-20 and ERC-721 assets.
title: Controller Inventory Management
---

# Inventory

Cartridge Controller provides Inventory modal to manage account assets (`ERC-20`, `ERC-721`) with integrated marketplace functionality for buying and selling digital assets.

## Configure tokens

By default, commonly used tokens are indexed and automatically shown. Full list of default tokens are listed in [`torii-config/public-tokens/mainnet.toml`](https://github.com/cartridge-gg/controller/blob/main/packages/torii-config/public-tokens/mainnet.toml). This list can be extended by configuring Torii hosted on Slot.

### Configure additional token to index

```toml
# torii-config.toml

[indexing]
contracts = [
  "erc20:<contract-address>",
  "erc721:<contract-address>"
]
```

### Create or update Torii instance on Slot

```sh
slot d create <project> torii --config <path/to/torii-config.toml>
```

### Configure Controller

Provide Slot project name to `ControllerOptions`.

```typescript
const controller = new Controller({
  slot: "<torii-url>"
});

// or via connector
const connector = new CartridgeConnector({
  slot: "<torii-url>"
})
```

### Open Inventory modal

```typescript
controller.openProfile("inventory");
```

## Marketplace Integration

The inventory system includes built-in marketplace functionality for ERC721 and ERC1155 assets:

### Features

- **Asset Purchasing**: Buy digital assets from marketplace listings with transparent fee structure
- **Collection Browsing**: Browse and purchase items from specific collections
- **Multi-token Support**: Purchase with various supported tokens
- **Smart Amount Rendering**: Automatically adjusts decimal precision for small amounts to ensure readability
- **Interactive Fee Tooltips**: Hover over fee information to see detailed breakdowns

### Marketplace Fees

When purchasing assets through the marketplace, multiple fee types are automatically calculated and displayed:

- **Client Fees**: Automatically calculated and applied to each transaction
- **Creator Royalties**: Honor creator royalty settings for supported collections when the `royalty_info` entrypoint is available
- **Marketplace Fees**: Platform fees as configured by the marketplace

### Fee Transparency

The purchase interface provides comprehensive fee transparency:

- **Fee Breakdown Tooltip**: Interactive tooltip showing detailed fee information including:
  - Marketplace Fee (with percentage)
  - Creator Royalties (with percentage)
  - Client Fee (with percentage)
- **Smart Decimal Precision**: Automatically calculates appropriate decimal places based on the value magnitude to ensure small amounts are clearly readable
- **Real-time Calculations**: All fees are calculated and displayed in real-time before transaction confirmation

All fees are clearly displayed before transaction confirmation, including both absolute amounts and percentage breakdowns.
