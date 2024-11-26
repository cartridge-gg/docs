# Inventory 

Cartridge Controller provides Inventory modal to manage account assets (`ERC-20`, `ERC-721`) tokens.

## Configure tokens

By default, commonly used tokens are indexed and automatically shown. ([default token list](https://github.com/cartridge-gg/controller/packages/torii-config/public-tokens/mainnet.toml)). This list can be extended by configuring Torii hosted on Slot.

### Configure additional token to index

```toml
# torii-config.toml

contracts = [
  { type = "ERC20", address = "<contract-address>" },
  { type = "ERC721", address = "<contract-address>" }
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
