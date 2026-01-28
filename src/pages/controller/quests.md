---
showOutline: 2
title: Quests
description: Learn how to implement Cartridge's Quest system that allows games to create time-based challenges with rewards and progress tracking for players.
---

# Quests

The Cartridge Quest system enables games to create time-based challenges and objectives for players with built-in progress tracking, rewards, and completion mechanics.

## Key Features

- **Time-based Quests**: Define quest intervals, durations, and deadlines
- **Task Management**: Break down quests into multiple trackable tasks
- **Progress Tracking**: Real-time advancement monitoring for each task
- **Reward System**: Configurable rewards for quest completion
- **Conditional Quests**: Prerequisites and dependencies between quests
- **Real-time Updates**: Live quest status via Torii subscriptions

## Benefits for Game Developers

- **Player Engagement**: Keep players active with time-sensitive objectives
- **Progression Systems**: Create structured advancement paths
- **Community Events**: Coordinate time-based community challenges
- **Retention**: Recurring quest intervals for ongoing engagement
- **Analytics**: Track player participation and completion rates

## How It Works

Each quest consists of:
- **Quest Definition**: Core quest parameters (timing, tasks, conditions)
- **Quest Metadata**: Display information (name, description, icon, rewards)
- **Tasks**: Individual objectives that must be completed
- **Advancement**: Player progress tracking for each task
- **Completion**: Final quest completion state and reward claiming

## Setup

### Dependencies

Add the Cartridge `quest` package as a dependency in your Scarb.toml:

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
Don't forget to add the corresponding writes while deploying your contract if not globally declared:

```toml
[writers]
"<namespace>-QuestCreation" = ["<namespace>-Actions"]
"<namespace>-QuestProgression" = ["<namespace>-Actions"]
"<namespace>-QuestAdvancement" = ["<namespace>-Actions"]
"<namespace>-QuestCompletion" = ["<namespace>-Actions"]
"<namespace>-QuestDefinition" = ["<namespace>-Actions"]
```
:::

### Torii Configuration

Quest events require historical tracking by Torii for proper progress monitoring:

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

### Controller Configuration

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

## Creating Quests

Define quests in your game world using the quest system structures:

```rust
use quest::models::{QuestDefinition, QuestTask, QuestMetadata};

// Define quest tasks
let task = QuestTask {
    id: 'win_battles',
    description: "Win battles against other players",
    total: 10_u128,
};

// Create quest definition
let definition = QuestDefinition {
    id: 'daily_pvp',
    start: get_block_timestamp(), // Quest start time
    end: get_block_timestamp() + 86400, // 24 hours later
    duration: 3600, // 1 hour active duration
    interval: 86400, // Daily interval
    tasks: array![task],
    conditions: array![], // No prerequisites
    rewarder: rewarder_contract_address,
};

// Emit creation event
emit!(world, QuestCreation {
    id: definition.id,
    definition,
    metadata: quest_metadata,
});
```

### Quest Timing Patterns

**One-time Quests:**
```rust
QuestDefinition {
    start: quest_start_time,
    end: quest_end_time,
    duration: 0, // No duration limit
    interval: 0, // No recurrence
    // ...
}
```

**Recurring Quests:**
```rust
QuestDefinition {
    start: first_occurrence,
    end: last_possible_occurrence,
    duration: 3600, // 1 hour duration
    interval: 86400, // Every 24 hours
    // ...
}
```

**Limited-time Events:**
```rust
QuestDefinition {
    start: event_start,
    end: event_end,
    duration: event_end - event_start,
    interval: 0,
    // ...
}
```

## Tracking Progress

Track player progress by emitting advancement events:

```rust
use quest::events::QuestAdvancement;

// When player makes progress on a task
fn update_quest_progress(
    world: IWorldDispatcher,
    player_id: ContractAddress,
    task_id: felt252,
    progress_amount: u128
) {
    emit!(world, QuestAdvancement {
        player_id,
        quest_id: 'daily_pvp',
        task_id,
        interval_id: get_current_interval_id(),
        timestamp: get_block_timestamp(),
        count: progress_amount,
    });
}
```

## Quest Completion

Handle quest completion and reward claiming:

```rust
use quest::events::QuestCompletion;

// Mark quest as completed
fn complete_quest(
    world: IWorldDispatcher,
    player_id: ContractAddress,
    quest_id: felt252
) {
    emit!(world, QuestCompletion {
        player_id,
        quest_id,
        interval_id: get_current_interval_id(),
        timestamp: get_block_timestamp(),
        unclaimed: true, // Rewards not yet claimed
        lock_count: 0,
    });
}
```

## Quest Metadata

Define quest display information:

```json
{
  "name": "Daily PvP Champion",
  "description": "Defeat 10 opponents in PvP battles",
  "icon": "https://example.com/quest-icon.png",
  "registry": "0x...", // Registry contract address
  "rewards": [
    {
      "name": "Victory Token",
      "description": "Exclusive victory commemorative NFT",
      "icon": "https://example.com/reward-icon.png"
    }
  ]
}
```

## Quest Dependencies

Create quest dependencies using conditions:

```rust
// Quest that requires completing other quests
QuestDefinition {
    id: 'master_quest',
    conditions: array!['basic_quest', 'intermediate_quest'],
    // ... other fields
}
```

Conditional quests will remain locked until all prerequisite quests are completed.

## Frontend Integration

The Controller automatically provides quest UI when configured.

### Using the Hook

```typescript
import { useQuests } from '@cartridge/connector';

function QuestComponent() {
  const { quests, status, refresh } = useQuests();

  if (status === 'loading') return <div>Loading quests...</div>;
  if (status === 'error') return <div>Error loading quests</div>;

  return (
    <div>
      {quests.map(quest => (
        <div key={quest.id}>
          <h3>{quest.name}</h3>
          <div>Progress: {quest.progression}%</div>
          {quest.completed && !quest.claimed && (
            <button onClick={() => claimReward(quest)}>
              Claim Reward
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
```

### Quest Properties

```typescript
type QuestProps = {
  id: string;
  intervalId: number;
  name: string;
  end: number;
  completed: boolean;
  locked: boolean;
  claimed: boolean;
  progression: number;
  registry: string;
  rewards: Item[];
  tasks: {
    description: string;
    total: bigint;
    count: bigint;
  }[];
};
```

## Best Practices

### Quest Design
- Keep tasks clear and achievable
- Use appropriate timing for your game's pacing
- Balance difficulty with rewards
- Consider player timezone differences for timed events

### Progress Tracking
- Emit progress events immediately when actions occur
- Use consistent task identifiers across your game
- Include sufficient progress data for proper tracking
- Handle edge cases (player disconnection, etc.)

### Performance
- Use historical events in Torii for progress data
- Consider batching progress updates for frequent actions
- Cache quest metadata to reduce on-chain reads
- Implement proper error handling for failed events

## Examples

For a complete working example, see the [GitHub repository](https://github.com/cartridge-gg/arcade) quest implementation.
