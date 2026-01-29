---
showOutline: 1
title: Marketplace Setup
description: Learn how to set up your game's Marketplace
---

# Marketplace

The Cartridge Marketplace brings onchain assets directly to your players, enabling richer and more complex game experiences.

## Adding Assets

Adding assets to your game's marketplace is simple.
First, configure your game's Torii instances to index the asset, and then configure your Controller with Torii.

::::steps

#### Configure your Torii

Every digital asset on the Marketplace must be indexed by Torii.
To configure Torii to index an onchain asset, add the token address to the configuration file:

```toml
# torii.toml

[indexing]
contracts = [
  "erc20:<contract-address>",
  "erc721:<contract-address>"
]
```

:::info
See the [Torii docs](https://book.dojoengine.org/toolchain/torii/configuration#indexing-configuration) for more information about indexing token contracts.
:::

#### Add Torii to Controller

Once Torii is indexing your asset, pass the URL to your game's Controller.
The URL of your Torii instance should be passed as the `slot` option:

```ts
import { Controller } from '@cartridge/controller'

controller = new Controller({
  // other options
  slot: "https://api.cartridge.gg/x/my-game/torii"
})
```

:::info
See the [Slot docs](/slot/getting-started) for more information about creating Torii instances with Slot.
:::

:::warning
Controller instances can only be configured with a single Torii instance, so ensure that all your Marketplace assets are indexed by the same Torii.
:::

::::
