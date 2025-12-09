---
title: Quest Integration
description: Learn how to integrate the Cartridge Quest system into your game, including creating quests, tracking progress, and managing rewards.
---

# Integration

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

## Quest Timing

Quests support flexible timing patterns:

### One-time Quests
```rust
QuestDefinition {
    start: quest_start_time,
    end: quest_end_time,
    duration: 0, // No duration limit
    interval: 0, // No recurrence
    // ...
}
```

### Recurring Quests
```rust
QuestDefinition {
    start: first_occurrence,
    end: last_possible_occurrence,
    duration: 3600, // 1 hour duration
    interval: 86400, // Every 24 hours
    // ...
}
```

### Limited-time Events
```rust
QuestDefinition {
    start: event_start,
    end: event_end,
    duration: event_end - event_start,
    interval: 0,
    // ...
}
```

## Progress Tracking

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

## Frontend Integration

The Controller automatically provides quest UI when configured:

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

Each quest object contains:

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

## Quest Conditions

Create quest dependencies:

```rust
// Quest that requires completing other quests
QuestDefinition {
    id: 'master_quest',
    conditions: array!['basic_quest', 'intermediate_quest'],
    // ... other fields
}
```

Conditional quests will remain locked until all prerequisite quests are completed.

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

## Example Implementation

For a complete working example, see the [GitHub repository](https://github.com/cartridge-gg/arcade) quest implementation.