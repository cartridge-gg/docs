---
title: Quest Setup
description: Learn how to set up and configure the Cartridge Quest system in your game, including dependency management and Torii configuration.
---

# Setup

## Getting Started

Add the Cartridge package `quest` as a dependency in your Scarb.toml

```rust
[dependencies]
starknet = "2.8.4"
dojo = { git = "https://github.com/dojoengine/dojo", tag = "v1.5.1" }
quest = { git = "https://github.com/cartridge-gg/arcade", tag = "v1.5.1" } // [!code focus]

[[target.starknet-contract]]
build-external-contracts = [
    "dojo::world::world_contract::world",
    "quest::events::index::e_QuestCreation", // [!code focus]
    "quest::events::index::e_QuestProgression", // [!code focus]
    "quest::events::index::e_QuestAdvancement", // [!code focus]
    "quest::events::index::e_QuestCompletion", // [!code focus]
]
```

:::info
Do not forget to add the corresponding writes while deploying your contract if not globally declared.

```toml
[writers]
"<namespace>-QuestCreation" = ["<namespace>-Actions"]
"<namespace>-QuestProgression" = ["<namespace>-Actions"]  
"<namespace>-QuestAdvancement" = ["<namespace>-Actions"]
"<namespace>-QuestCompletion" = ["<namespace>-Actions"]
"<namespace>-QuestDefinition" = ["<namespace>-Actions"]
```

:::

## Torii Configuration

Quest events require historical tracking by Torii for proper progress monitoring.

All quest-related events should be configured as historical events to ensure complete tracking:

```toml
rpc = <YOUR-RPC-URL>
world_address = <YOUR-WORLD-ADDRESS>

[indexing]
...

[sql] // [!code focus]
historical = [ // [!code focus]
    "<YOUR-NAMESPACE>-QuestProgression", // [!code focus]
    "<YOUR-NAMESPACE>-QuestAdvancement", // [!code focus]
] // [!code focus]
```

:::info
Quest Definition and Creation events are typically not historical since they should only be emitted once per quest.

Quest Completion events may be historical depending on whether you need to track multiple completions per quest interval.

:::

## Controller Configuration

Configure the Controller to enable quest functionality:

```typescript
import { ControllerConnector } from "@cartridge/connector";

const connector = new ControllerConnector({
  // Your existing configuration
  namespace: "your-game-namespace", // Required for quest data
  // ... other options
});
```

The `namespace` parameter is required for the quest system to fetch quest data from the Torii indexer.

## Quest Data Models

The quest system uses several on-chain models:

- **QuestDefinition**: Core quest configuration (timing, tasks, conditions)
- **QuestCreation**: Quest metadata and creation events
- **QuestProgression**: Player task progress tracking
- **QuestAdvancement**: Individual task advancement events  
- **QuestCompletion**: Quest completion and reward claiming state

These models are automatically handled by the quest system when properly configured.

## Next Steps

Once setup is complete, you can:
1. Create quest definitions in your game
2. Integrate quest progression events
3. Use the built-in quest UI components
4. Configure quest rewards and metadata

See the [Integration](/controller/quests/integration) guide for implementation details.