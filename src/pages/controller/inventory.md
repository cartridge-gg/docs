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
- **Fee Management**: Automatic calculation and display of marketplace fees, creator royalties, and client fees
- **Multi-token Support**: Purchase with supported tokens (ETH, STRK, USDC, LORDS)
- **Transaction Safety**: All marketplace transactions include proper fee disclosure and confirmation flows
