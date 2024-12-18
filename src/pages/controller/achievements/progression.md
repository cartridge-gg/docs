---
title: Achievement Progression
description: Learn how to implement achievement progression tracking in your game using Cartridge's event-based system and API.
---

# Achievement Progression

## Getting Started

Emit events to track the progress of the player.

The package provides also a way to be used as a cairo package.

```rust
#[dojo::contract]
pub mod Actions {
    use arcade_trophy::store::{Store, StoreTrait};
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
It is also possible to use the component directly, e.g:

`self.achievable.progress(world, player_id, task_id, count)`
:::

## API References

### `AchievableComponent.progress`

```rust
AchievableComponent.create(
    self: @ComponentState<TContractState>,
    world: WorldStorage,
    player_id: felt252,
    task_id: felt252,
    count: u32,
)
```

See also [AchievableComponent](https://github.com/cartridge-gg/arcade/blob/main/packages/achievement/src/components/achievable.cairo)

#### Parameters

- `self`: The component state.
- `world`: The world storage.
- `player_id`: The player identifier.
- `task_id`: The task identifier.
- `count`: The progression count to add.

## Gallery

- [DopeWars](https://github.com/cartridge-gg/dopewars/blob/mainnet/src/systems/helpers/shopping.cairo)
