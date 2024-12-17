---
title: Achievement Setup
description: Learn how to set up and configure the Cartridge Achievement system in your game, including dependency management and Torii configuration.
---

# Setup

## Getting Started

Add the Cartridge achievements package `arcade_trophy` as a dependency in your Scarb.toml

```rust
[dependencies]
starknet = "2.8.4"
dojo = { git = "https://github.com/dojoengine/dojo", tag = "v1.0.0" }
arcade_trophy = { git = "https://github.com/cartridge-gg/arcade", tag = "v1.0.0" } // [!code focus]

[[target.starknet-contract]]
build-external-contracts = [
    "dojo::world::world_contract::world",
    "arcade_trophy::events::index::e_TrophyCreation", // [!code focus]
    "arcade_trophy::events::index::e_TrophyProgression", // [!code focus]
]
```

:::info
Do not forget to add the corresponding writes while deploying your contract if not globally declared.

```toml
[writers]
"<namespace>-TrophyCreation" = ["<namespace>-Actions"]
"<namespace>-TrophyProgression" = ["<namespace>-Actions"]
```

:::

## Torii configuration

The progression events require to be managed as historical events by Torii.

It means that every single events will remain available in the torii database and accessible in the `event_messages_historical` table.

```toml
rpc = <YOUR-RPC-URL>
world_address = <YOUR-WORLD-ADDRESS>

[indexing]
...

[events] // [!code focus]
raw = true // [!code focus]
historical = ["<YOUR-NAMESPACE>-TrophyProgression"] // [!code focus]
```

:::info
The `TrophyCreation` event is not required to be an historical event since it should only be emitted once at the creation of the trophy.

If a new `TrophyCreation` event is emitted with the same keys that an existing one, it will replace the existing one.

This behavior can be useful if you want to change the metadata of a trophy.

:::

## Gallery

- [DopeWars](https://github.com/cartridge-gg/dopewars/blob/mainnet/Scarb.toml)
