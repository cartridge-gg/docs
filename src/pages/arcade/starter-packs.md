---
showOutline: 1
title: Starter Packs
description: Create and register starter packs on the Arcade registry to distribute game assets to players through purchase or claim flows.
---

# Starter Packs

Starter packs let you bundle game assets and distribute them to players through a purchase flow integrated with [Cartridge Controller](/controller/starter-packs).
The Arcade starter pack registry is a permissionless onchain system --- anyone can register a starter pack by deploying an implementation contract and calling `register`.

## How It Works

The registry follows a two-contract pattern:

1. **Implementation contract** --- a contract you deploy that implements the `IStarterpackImplementation` interface.
When a player purchases your starter pack, the registry calls your contract's `on_issue` function to distribute assets.
2. **Registry contract** --- the Arcade registry where you register your implementation, set pricing, and configure options.

```
Player purchases → Registry collects payment → Registry calls on_issue → Your contract distributes assets
```

## Implementation Contract

Your implementation contract must expose two functions:

```cairo
#[starknet::interface]
trait IStarterpackImplementation<TContractState> {
    /// Called by the registry when a starter pack is issued.
    /// Distribute assets to the recipient here.
    fn on_issue(
        ref self: TContractState,
        recipient: ContractAddress,
        starterpack_id: u32,
        quantity: u32,
    );

    /// Return the supply limit, or None for unlimited.
    fn supply(self: @TContractState, starterpack_id: u32) -> Option<u32>;
}
```

`on_issue` is where you mint tokens, transfer NFTs, or perform any onchain action to fulfill the starter pack.
The registry will only call `on_issue` after payment has been collected.

:::warning
`on_issue` is a public function which should typically be callable only by the registry contract.
:::

### Example: ERC721 Starter Pack

A minimal implementation that mints an NFT to the recipient:

```cairo
#[abi(embed_v0)]
impl StarterpackImpl of IStarterpackImplementation<ContractState> {
    fn on_issue(
        ref self: ContractState,
        recipient: ContractAddress,
        starterpack_id: u32,
        quantity: u32,
    ) {
        assert(self.starterpacks.read(starterpack_id), 'Invalid starterpack');
        self.mint(recipient);
    }

    fn supply(self: @ContractState, starterpack_id: u32) -> Option<u32> {
        Option::None // Unlimited supply
    }
}
```

See the full example at [cartridge-gg/activations](https://github.com/cartridge-gg/activations/tree/main/erc721).

## Registering a Starter Pack

Once your implementation contract is deployed, register it with the Arcade registry by calling `register`:

```cairo
fn register(
    ref self: TContractState,
    implementation: ContractAddress,           // Your deployed implementation contract
    referral_percentage: u8,                   // Percentage of base price paid to referrers (0-50)
    reissuable: bool,                          // Whether a player can purchase more than once
    price: u256,                               // Price per unit in payment token
    payment_token: ContractAddress,            // ERC20 token used for payment
    payment_receiver: Option<ContractAddress>, // Payment destination (defaults to caller)
    metadata: ByteArray,                       // JSON metadata (see below)
    conditional: bool,                         // Whether purchases require a voucher
) -> u32; // Returns the starter pack ID
```

The returned ID is what players use to purchase the starter pack via [`controller.openStarterPack(id)`](/controller/starter-packs).

## Parameters

### `reissuable`

Controls whether the same player can purchase the starter pack more than once.

- `false` --- each player can only purchase once, and `quantity` is forced to 1
- `true` --- players can purchase multiple times with any quantity

### `referral_percentage`

Percentage of the base price paid to a referrer when one is provided during purchase.
Maximum is 50.
Self-referrals (referrer == payer) are ignored.

### `payment_receiver`

Where the base price (minus any referral fee) is sent.
If `None`, payment goes to the starter pack owner (the address that called `register`).
If `Some(address)`, payment goes to that address instead --- useful for treasury contracts or revenue sharing.

### `conditional`

When `true`, purchases require a voucher.
Vouchers are granted by an admin via the `allow` function, which authorizes a specific recipient address.
The player must provide the matching `voucher_key` when purchasing.

### Metadata

The `metadata` parameter is a JSON string describing the starter pack for display in the UI.
Use the `MetadataTrait` helper from the starterpack package to construct it:

```cairo
use starterpack::types::item::ItemTrait;
use starterpack::types::metadata::MetadataTrait;

let sword = ItemTrait::new("Sword", "A mighty sword", "https://example.com/sword.png");

let metadata = MetadataTrait::new(
    name: "My Starter Pack",
    description: "A pack of game assets",
    image_uri: "https://example.com/image.png",
    items: [sword].span(),
    tokens: [].span(),                      // Additional payment token hints for the UI
    conditions: ["Must be level 5"].span(), // Display-only condition strings
).jsonify();
```

## Managing Starter Packs

After registration, the owner can manage the starter pack:

- **`update`** --- change implementation, pricing, referral percentage, or other parameters
- **`update_metadata`** --- update the display metadata
- **`pause`** / **`resume`** --- temporarily disable or re-enable purchases

## Payment Flow

When a player purchases a starter pack, the registry handles payment distribution:

1. **Referral fee** --- if a referrer is provided, their percentage is deducted from the base price and sent to them
2. **Protocol fee** --- a fee is added on top of the base price and sent to the Arcade fee receiver
3. **Owner payment** --- the remaining base price (after referral fee) is sent to the `payment_receiver` or owner
4. **Asset distribution** --- the registry calls `on_issue` on the implementation contract

If `price` is zero, all payment steps are skipped and `on_issue` is called directly.
