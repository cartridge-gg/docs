# Testing

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