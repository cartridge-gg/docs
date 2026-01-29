---
showOutline: 1
title: Achievements
description: Learn how to implement Cartridge's Achievement system that allows games to reward players for completing in-game objectives and track their progress.
---

# Achievements

The Cartridge Achievements system enables games to reward players for completing achievements with built-in progress tracking and Cartridge points.

## Key Features

- **Packages**: Games can define achievements using the provided Cairo packages
- **Rewards**: Games can reward players with Cartridge points for completing achievements
- **Profile**: Players can view their achievements and scores without leaving the game

## Benefits for Game Developers

- **Simplicity**: Easy integration with existing Starknet smart contracts and Dojo
- **Cost-effectiveness**: Achievements are event-based, no additional storage is required
- **Performance** (coming soon): Plugin attached to Torii to improve achievement computation performance

## How It Works

Achievements consist of:
- **Achievement Definition**: A unique `identifier`, `title`, `description`, and set of `tasks`
- **Tasks**: Each task has an `identifier`, `total` target, and `description`
- **Completion**: A task completes when enough progression has been made; an achievement completes when all its tasks are completed

For the complete implementation, see the [GitHub repository](https://github.com/cartridge-gg/arcade).

## Setup

### Dependencies

Add the Cartridge `achievement` package as a dependency in your Scarb.toml:

```rust
[dependencies]
starknet = "2.8.4"
dojo = { git = "https://github.com/dojoengine/dojo", tag = "v1.5.1" }
achievement = { git = "https://github.com/cartridge-gg/arcade", tag = "v1.5.1" } // [!code focus]

[[target.starknet-contract]]
build-external-contracts = [
    "dojo::world::world_contract::world",
    "achievement::events::index::e_TrophyCreation", // [!code focus]
    "achievement::events::index::e_TrophyProgression", // [!code focus]
]
```

:::info
Don't forget to add the corresponding writes while deploying your contract if not globally declared:

```toml
[writers]
"<namespace>-TrophyCreation" = ["<namespace>-Actions"]
"<namespace>-TrophyProgression" = ["<namespace>-Actions"]
```
:::

### Torii Configuration

The progression events require historical event management by Torii, meaning every event will remain available in the `event_messages_historical` table:

```toml
rpc = <YOUR-RPC-URL>
world_address = <YOUR-WORLD-ADDRESS>

[indexing]
...

[sql] // [!code focus]
historical = ["<YOUR-NAMESPACE>-TrophyProgression"] // [!code focus]
```

:::info
The `TrophyCreation` event doesn't need to be historical since it should only be emitted once at trophy creation.
If a new `TrophyCreation` event is emitted with the same keys as an existing one, it will replace it—useful for updating trophy metadata.
:::

## Creating Achievements

Emit events to define your achievements using the provided Starknet components:

```rust
#[dojo::contract]
pub mod Actions {
    use achievement::components::achievable::AchievableComponent; // [!code focus]
    use achievement::types::task::{Task, TaskTrait}; // [!code focus]
    component!(path: AchievableComponent, storage: achievable, event: AchievableEvent); // [!code focus]
    impl AchievableInternalImpl = AchievableComponent::InternalImpl<ContractState>; // [!code focus]

    #[storage]
    struct Storage {
        #[substorage(v0)]
        achievable: AchievableComponent::Storage, // [!code focus]
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat]
        AchievableEvent: AchievableComponent::Event, // [!code focus]
    }

    fn dojo_init(self: @ContractState) {
        // [Event] Emit all Achievement creation events
        let world = self.world("<YOUR-NAMESPACE>");
        let task_id = 'TASK_IDENTIFIER';
        let task_target = 100;
        let task = TaskTrait::new(task_id, task_target, "Do something 100 times");
        let tasks: Span<Task> = array![task].span();

        self.achievable // [!code focus]
            .create( // [!code focus]
                world, // [!code focus]
                id: 'ACHIEVEMENT_IDENTIFIER', // [!code focus]
                hidden: false, // [!code focus]
                index: 0, // [!code focus]
                points: 10, // [!code focus]
                start: 0, // [!code focus]
                end: 0, // [!code focus]
                group: 'Group', // [!code focus]
                title: "Achievement title", // [!code focus]
                description: "The achievement description", // [!code focus]
                tasks: tasks, // [!code focus]
                data: "", // [!code focus]
                icon: 'fa-trophy', // [!code focus]
            ); // [!code focus]
        } // [!code focus]
    }
}
```

### AchievableComponent.create Parameters

```rust
AchievableComponent.create(
    self: @ComponentState<TContractState>,
    world: WorldStorage,
    id: felt252,
    hidden: bool,
    index: u8,
    points: u16,
    start: u64,
    end: u64,
    group: felt252,
    icon: felt252,
    title: felt252,
    description: ByteArray,
    tasks: Span<Task>,
    data: ByteArray,
)
```

| Parameter | Description |
|-----------|-------------|
| `id` | Unique achievement identifier |
| `hidden` | Whether to hide the achievement in the controller UI |
| `index` | Page index within the group for display ordering |
| `points` | Cartridge points to reward the player |
| `start` | Start timestamp for ephemeral achievements (`0` for everlasting) |
| `end` | End timestamp for ephemeral achievements (`0` for everlasting) |
| `group` | Achievement group for organizing achievements together |
| `icon` | [FontAwesome](https://fontawesome.com/icons) icon name (e.g., `fa-trophy`) |
| `title` | Achievement title |
| `description` | Achievement description |
| `tasks` | Achievement tasks (see Task type below) |
| `data` | Reserved for future use |

See also [AchievableComponent](https://github.com/cartridge-gg/arcade/blob/main/packages/achievement/src/components/achievable.cairo)

### Task Type

```rust
pub struct Task {
    id: felt252,
    total: u32,
    description: ByteArray,
}
```

| Parameter | Description |
|-----------|-------------|
| `id` | Task identifier (can be shared across achievements) |
| `total` | Target count for task completion |
| `description` | Task description |

See also [Task](https://github.com/cartridge-gg/arcade/blob/main/packages/trophy/src/types/task.cairo)

## Tracking Progression

Emit events to track player progress on tasks:

```rust
#[dojo::contract]
pub mod Actions {
    use achievement::store::{Store, StoreTrait};
    // ...
    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn play(ref self: ContractState, do: felt252) {
            let world = self.world(@"<YOUR-NAMESPACE>")
            // If the player meets the task requirement, emit an event to track the progress
            if do === 'something' {
                let store = StoreTrait::new(world);
                let player_id = starknet::get_caller_address();
                let task_id = 'TASK_IDENTIFIER';
                let count = 1;
                let time = starknet::get_block_timestamp();
                store.progress(player_id.into(), task_id, count, time);
            }
        }
    }
}
```

:::info
You can also use the component directly:
`self.achievable.progress(world, player_id, task_id, count)`
:::

### AchievableComponent.progress Parameters

```rust
AchievableComponent.progress(
    self: @ComponentState<TContractState>,
    world: WorldStorage,
    player_id: felt252,
    task_id: felt252,
    count: u32,
)
```

| Parameter | Description |
|-----------|-------------|
| `player_id` | The player identifier |
| `task_id` | The task identifier |
| `count` | Progression count to add |

## Client Integration

### Controller Configuration

Configure the controller with the required parameters:

```ts
new ControllerConnector({
  url,
  rpc,
  profileUrl,
  namespace: "dopewars", // [!code focus]
  slot: "ryomainnet", // [!code focus]
  theme,
  colorMode,
  policies,
});
```

### Opening the Achievements Page

Add a button to open the achievements page in your game client:

```ts
const { connector } = useAccount();

const handleClick = useCallback(() => {
  if (!connector?.controller) {
    console.error("Connector not initialized");
    return;
  }
  connector.controller.openProfile("achievements");
}, [connector]);
```

## Testing

Add the corresponding events to your namespace definition in tests:

```rust
fn namespace_def() -> NamespaceDef {
    NamespaceDef {
        namespace: "namespace", resources: [
            // ...
            TestResource::Event(achievement::events::index::e_TrophyCreation::TEST_CLASS_HASH),
            TestResource::Event(achievement::events::index::e_TrophyProgression::TEST_CLASS_HASH),
            TestResource::Contract(Actions::TEST_CLASS_HASH),
        ].span()
    };
}
```

## Examples

- [DopeWars Scarb.toml](https://github.com/cartridge-gg/dopewars/blob/mainnet/Scarb.toml)
- [DopeWars Systems](https://github.com/cartridge-gg/dopewars/blob/mainnet/src/systems/ryo.cairo)
- [DopeWars Progression](https://github.com/cartridge-gg/dopewars/blob/mainnet/src/systems/helpers/shopping.cairo)
- [DopeWars Connect Button](https://github.com/cartridge-gg/dopewars/blob/mainnet/web/src/components/wallet/ConnectButton.tsx)
