---
description: Learn how to use and configure the Cartridge Controller's Inventory modal for managing ERC-20 and ERC-721 assets.
title: Controller Inventory Management
---

# Inventory 

Cartridge Controller provides Inventory modal to manage account assets (`ERC-20`, `ERC-721`).

## Configure tokens

By default, commonly used tokens are indexed and automatically shown. Full list of default tokens are listed in [`torii-config/public-tokens/mainnet.tom`](https://github.com/cartridge-gg/controller/blob/main/packages/torii-config/public-tokens/mainnet.toml). This list can be extended by configuring Torii hosted on Slot.

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
  slot: "<project>" 
});

// or via connector
const connector = new CartridgeConnector({
  slot: "<project>" 
})
```

### Open Inventory modal

```typescript
controller.openProfile("inventory");
```
