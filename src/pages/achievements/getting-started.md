# Getting Started

The Cartridge Achievements is a system for games to reward players for completing achievements.

## Key Features

1.  **Packages**: Games can define achievements thanks to the provided packages.
2.  **Rewards**: Games can reward players with Cartridge points for completing achievements.
3.  **Profile**: Players can view their achievements and scores whitout leaving the game.

## How It Works

1.  The game defines a set of achievements that can be unlocked by players, emitted through events.
2.  The game emits events according to the progress of the player.
3.  Players can view the achievements and their progress in the game profile embedded in the controller.

## Benefits for Game Developers

- **Simplicity**: Easy integration with existing Starknet smart contracts and Dojo.
- **Cost-effectiveness**: Achievements are events based, no additional storage is required.
- **Performance** (coming soon): Plugin attached to Torii to improve the performances of the achievements computation.

## Integration

For detailed implementation and usage, refer to the [GitHub repository](https://github.com/cartridge-gg/arcade).

### 1. Add the Cartridge achievements package `arcade_trophy` as a dependency in your Scarb.toml

```rust
[dependencies]
starknet = "2.8.4"
dojo = { git = "https://github.com/dojoengine/dojo", tag = "v1.0.0" } // [!code focus]
arcade_trophy = { git = "https://github.com/cartridge-gg/arcade", tag = "v1.0.0" } // [!code focus]

[[target.starknet-contract]]
build-external-contracts = [
    "dojo::world::world_contract::world", // [!code focus]
    "arcade_trophy::events::index::e_TrophyCreation",
    "arcade_trophy::events::index::e_TrophyProgression", // [!code focus]
]
```

:::note
Do not forget to add the corresponding writes while deploying your contract if not globally declared.

```toml
[writers]
"<namespace>-TrophyCreation" = ["<namespace>-Actions"]
"<namespace>-TrophyProgression" = ["<namespace>-Actions"]
```

:::

### 2. Create your achievements

The package provides a way to define achievements leveraging Starknet components.

```rust
#[dojo::contract]
pub mod Actions { // [!code focus]
    use arcade_trophy::components::achievable::AchievableComponent;
    use arcade_trophy::types::task::{Task, TaskTrait};
    component!(path: AchievableComponent, storage: achievable, event: AchievableEvent);
    impl AchievableInternalImpl = AchievableComponent::InternalImpl<ContractState>; // [!code focus]

    #[storage]
    struct Storage {
        #[substorage(v0)] // [!code focus]
        achievable: AchievableComponent::Storage, // [!code focus]
    }

    #[event]
    #[derive(Drop, starknet::Event)]
    enum Event {
        #[flat] // [!code focus]
        AchievableEvent: AchievableComponent::Event, // [!code focus]
    }
      // Constructor

    fn dojo_init(self: @ContractState) {
        // [Event] Emit all Achievement creation events
        let world = self.world("<YOUR-NAMESPACE>");
        self
            .achievable
            .create(
                world,
                id: 'ACHIEVEMENT_IDENTIFIER',
                hidden: false,
                index: 0,
                points: 10,
                start: 0,
                end: 0,
                group: 'Achievement group',
                icon: 'fa-trophy',
                title: "Achievement title",
                description: "The achievement description",
                tasks: array![
                    TaskTrait::new(
                        id: 'TASK_IDENTIFIER',
                        total: 100,
                        description: "Do something 100 times",
                    ),
                ].span(),
                data: "",
            );
        }
    }
}
```

:::info
The package can also be used as a cairo package (see example below).
:::

### 3. Emit events to track the progress of the player

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
It is also possible to use the component directly: `self.achievable.progress(world, player_id, task_id, count)`
:::

### 4. Integrate the achievements page in your game client

You can add this following callback to a button to open the achievements page.

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

### 5. Testing

Do not forget to add the corresponding events to your namespace definition while you setup your tests.

```rust
fn namespace_def() -> NamespaceDef {
    NamespaceDef {
        namespace: "namespace", resources: [
            // ...
            TestResource::Event(arcade_trophy::events::index::e_TrophyCreation::TEST_CLASS_HASH),
            TestResource::Event(arcade_trophy::events::index::e_TrophyProgression::TEST_CLASS_HASH),
            TestResource::Contract(Actions::TEST_CLASS_HASH),
        ].span()
    };
}
```
