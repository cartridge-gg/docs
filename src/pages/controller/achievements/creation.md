---
title: Achievement Creation
description: Learn how to create and define achievements in your game using Cartridge's achievement system, including task definitions and metadata configuration.
---

# Achievement Creation

## Getting Started

Emit events to define your achievements.

The package provides a way to define achievements leveraging Starknet components.

```rust
#[dojo::contract]
pub mod Actions {
    use arcade_trophy::components::achievable::AchievableComponent; // [!code focus]
    use arcade_trophy::types::task::{Task, TaskTrait}; // [!code focus]
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
      // Constructor

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

:::info
The package can also be used as a cairo package (see example below).
:::

## API References

### `AchievableComponent.create`

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

See also [AchievableComponent](https://github.com/cartridge-gg/arcade/blob/main/packages/achievement/src/components/achievable.cairo)

#### Parameters

- `self`: The component state.
- `world`: The world storage.
- `id`: The achievement identifier, it should be unique.
- `hidden`: Speicify if you want the achievement to be hidden in the controller UI.
- `index`: The achievement index which is the page in which the achievement will be displayed within the group.
- `points`: The achievement points to reward the player.
- `start`: The achievement start timestamp, it should be used for ephemeral achievements, `0` for everlasting achievements.
- `end`: The achievement end timestamp, it should be used for ephemeral achievements, `0` for everlasting achievements.
- `group`: The achievement group, it should be used to group achievements together (see also `index` to define multiple pages).
- `icon`: The achievement icon, it should be a [FontAwesome](https://fontawesome.com/icons) icon name (e.g. `fa-trophy`).
- `title`: The achievement title.
- `description`: The achievement global description.
- `tasks`: The achievement tasks (see also `Task` type).
- `data`: The achievement data, not used yet but could have a future use.

:::info
The `hidden` parameter is purely a UI feature.
:::

### `Task`

```rust
pub struct Task {
    id: felt252,
    total: u32,
    description: ByteArray,
}
```

See also [Task](https://github.com/cartridge-gg/arcade/blob/main/packages/trophy/src/types/task.cairo)

#### Parameters

- `id`: The task identifier, it should be unique but used in several achievements.
- `total`: The task target, once reached the achievement task is completed.
- `description`: The task description.

## Gallery

- [DopeWars](https://github.com/cartridge-gg/dopewars/blob/mainnet/src/systems/ryo.cairo)
