---
description: Learn how to use and configure the Cartridge Controller's Inventory modal for managing ERC-20, ERC-721, and ERC-1155 assets.
title: Controller Inventory Management
---

# Inventory

Cartridge Controller provides Inventory modal to manage account assets (`ERC-20`, `ERC-721`, `ERC-1155`) with integrated marketplace functionality for buying and selling digital assets.

## Configure tokens

By default, commonly used tokens are indexed and automatically shown. Full list of default tokens are listed in [`torii-config/public-tokens/mainnet.toml`](https://github.com/cartridge-gg/controller/blob/main/packages/torii-config/public-tokens/mainnet.toml). This list can be extended by configuring Torii hosted on Slot.

### Configure additional token to index

```toml
# torii-config.toml

[indexing]
contracts = [
  "erc20:<contract-address>",
  "erc721:<contract-address>",
  "erc1155:<contract-address>"
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

## ERC-1155 Support

The Controller provides comprehensive support for ERC-1155 multi-token standard, offering enhanced features for managing fungible and non-fungible tokens within the same contract.

### Key Features

- **Amount Tracking**: For ERC-1155 tokens, the inventory displays the quantity owned for each token ID
- **Balance Management**: Automatic balance fetching and display for all token types within a contract
- **Transfer History**: Complete transfer tracking for ERC-1155 tokens including amounts and transaction details
- **Collection Browsing**: Browse collections containing both unique and fungible tokens
- **Marketplace Integration**: Full marketplace support for buying and selling ERC-1155 assets

### Enhanced Asset Information

ERC-1155 assets in the inventory display additional information compared to ERC-721 tokens:

- **Token Amount**: Shows the quantity owned for fungible ERC-1155 tokens
- **Collection Type**: Clearly identifies ERC-1155 contracts vs ERC-721
- **Balance History**: Track balance changes over time for each token ID

## Marketplace Integration

The inventory system includes built-in marketplace functionality for ERC721 and ERC1155 assets:

### Features

- **Asset Purchasing**: Buy digital assets from marketplace listings with transparent fee structure
- **Collection Browsing**: Browse and purchase items from specific collections
- **Multi-token Support**: Purchase with supported tokens (ETH, STRK, USDC, LORDS)
- **Transaction Safety**: All marketplace transactions include proper fee disclosure and confirmation flows

### Fee Transparency

When purchasing assets through the marketplace, multiple fee types are automatically calculated and displayed:

- **Client Fees**: Automatically calculated and applied to each transaction
- **Creator Royalties**: Honor creator royalty settings for supported collections (when the `royalty_info` entrypoint is available)
- **Marketplace Fees**: Platform fees as configured by the marketplace
- **Smart Amount Rendering**: Automatically adjusts decimal precision for small amounts to ensure readability
- **Interactive Fee Tooltips**: Hover over fee information to see detailed breakdowns
