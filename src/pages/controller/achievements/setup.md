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

## Gallery

- [DopeWars](https://github.com/cartridge-gg/dopewars/blob/mainnet/Scarb.toml)
