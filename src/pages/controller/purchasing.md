---
description: Learn how to integrate Cartridge Controller's purchase and monetization features, including starterpack purchases and credit transactions using multiple payment methods.
title: Purchase Integration
---

# Purchase Integration

Cartridge Controller provides built-in purchase functionality that enables seamless monetization for games and applications.
The purchase system supports both traditional payment methods (credit cards) and cryptocurrency transactions across multiple blockchain networks.

## Overview

The purchase system includes:

- **Starterpack Purchases**: Pre-configured bundles of game assets and credits with streamlined purchasing flow
- **Starterpack Claims**: Free starterpack bundles that users can claim based on eligibility, featuring collection support display
- **Credit Purchases**: Direct credit top-ups for gasless transactions
- **Multichain Payment Support**: Accept payments on Starknet, Ethereum (Base), Arbitrum, and Optimism with unified payment method selection
- **Multiple Wallet Integration**: Support for popular wallets across different ecosystems with automatic chain switching for compatible wallets
- **Unified Payment Interface**: Both fiat (credit card) and crypto payment options displayed on a single screen
- **NFT Marketplace Support**: ERC721 and ERC1155 listing and purchase capabilities with integrated client fee structure

## Quick Start

### Opening Purchase Flows

Controller provides simple methods to open purchase interfaces:

```typescript
import Controller, { StarterPack, StarterPackItemType } from "@cartridge/controller";

const controller = new Controller();

// Open credit purchase flow
controller.openPurchaseCredits();

// Open starterpack purchase/claim flow (works for both paid and free starterpacks)
controller.openStarterPack("starterpack-id-123");

// Open custom starterpack with configuration object
const customPack: StarterPack = {
  name: "Beginner Pack",
  description: "Essential items for new players",
  items: [
    {
      type: StarterPackItemType.FUNGIBLE,
      name: "Gold Coins",
      description: "In-game currency",
      amount: 100,
      price: 5000000n, // $5.00 in USDC micro-units
      call: [{ contractAddress: "0x123...", entrypoint: "mint", calldata: ["user", "100", "0"] }]
    }
  ]
};
controller.openStarterPack(customPack);
```

## API Reference

### openPurchaseCredits()

Opens the credit purchase interface, allowing users to buy credits for gasless transactions and other platform services.

```typescript
controller.openPurchaseCredits();
```

**Parameters:** None

**Returns:** `void`

**Usage Example:**
```typescript
// In a game's UI, add a "Buy Credits" button
const handleBuyCredits = () => {
  controller.openPurchaseCredits();
};
```

### openStarterPack(options: string | number | StarterPack)

Opens the starterpack interface for a specific starterpack bundle or a custom starter pack configuration. This method works for both paid starterpacks (requiring purchase) and free starterpacks (that can be claimed based on eligibility). The method now supports dual-path architecture with automatic backend/onchain detection.

```typescript
controller.openStarterPack(options: string | number | StarterPack);
```

**Parameters:**
- `options` (string | number | StarterPack): 
  - **Numeric ID** (number): Onchain starterpack ID for smart contract-based starterpacks
  - **String ID** (string): Backend starterpack UUID for GraphQL-based starterpacks
  - **StarterPack object**: Complete StarterPack configuration object for custom packs

**Returns:** `void`

**Usage Examples:**

```typescript
// Backend starterpack - existing usage with string UUID
const handleBuyBackendStarterpack = () => {
  controller.openStarterPack("beginner-pack-2024");
};

// Onchain starterpack - new usage with numeric ID
const handleBuyOnchainStarterpack = () => {
  controller.openStarterPack(12345); // Numeric ID for onchain starterpack
};

// Offer free claimable starterpack (backend)
const handleClaimStarterpack = () => {
  controller.openStarterPack("free-welcome-pack-2024");
};

// Custom starter pack with outside execution
const customPack: StarterPack = {
  name: "Warrior Starter Pack",
  description: "Everything you need to start your adventure",
  iconURL: "https://example.com/warrior-pack.png",
  items: [
    {
      type: StarterPackItemType.NONFUNGIBLE,
      name: "Legendary Sword",
      description: "A powerful starting weapon",
      iconURL: "https://example.com/sword.png",
      amount: 1,
      price: 50000000n, // 50 USDC in micro-units (6 decimals)
      call: [
        {
          contractAddress: "0x123...",
          entrypoint: "mint",
          calldata: [userAddress, "1", "0"]
        }
      ]
    },
    {
      type: StarterPackItemType.FUNGIBLE,
      name: "Gold Coins",
      description: "In-game currency",
      amount: 1000,
      price: 10000n, // 0.01 USDC in micro-units
      call: [
        {
          contractAddress: "0x456...",
          entrypoint: "transfer",
          calldata: [userAddress, "1000", "0"]
        }
      ]
    }
  ]
};

const handleCustomStarterpack = () => {
  controller.openStarterPack(customPack);
  // Total price: $60.00 (50 + 1000×0.01), all calls executed after payment
};
```

## StarterPack Configuration

The `StarterPack` interface enables you to create custom starter pack bundles with associated contract calls that are executed automatically after successful payment. This provides complete control over the purchase experience and allows for complex multi-item bundles.

### StarterPack Interface

```typescript
interface StarterPack {
  name: string;
  description: string;
  iconURL?: string;
  items: StarterPackItem[];
}
```

**Properties:**
- `name` (string): Display name for the starter pack
- `description` (string): Description shown to users
- `iconURL` (string, optional): URL for the pack icon/image
- `items` (StarterPackItem[]): Array of items included in the pack

### StarterPackItem Interface

```typescript
interface StarterPackItem {
  type: StarterPackItemType;
  name: string;
  description: string;
  iconURL?: string;
  amount?: number;
  price?: bigint;
  call?: Call[];
}
```

**Properties:**
- `type` (StarterPackItemType): Type of item (NONFUNGIBLE or FUNGIBLE)
- `name` (string): Display name for the item
- `description` (string): Item description
- `iconURL` (string, optional): URL for item icon/image
- `amount` (number, optional): Quantity of the item
- `price` (bigint, optional): Price in USDC micro-units (6 decimals, e.g., 1000000n = $1.00)
- `call` (Call[], optional): Contract calls to execute for this item after payment

### StarterPackItemType Enum

```typescript
enum StarterPackItemType {
  NONFUNGIBLE = "NONFUNGIBLE",  // Unique items like NFTs, weapons, characters
  FUNGIBLE = "FUNGIBLE"         // Quantity-based items like coins, potions, resources
}
```

### Key Features

- **Outside Execution**: Contract calls are automatically aggregated into a multicall and executed after successful payment
- **Dynamic Pricing**: Total pack price is calculated from `sum(item.price × item.amount)`
- **Flexible Calls**: Any contract calls can be included - minting, transfers, game state updates, etc.
- **UI Generation**: Purchase interface renders directly from the provided data structure
- **Self-Contained**: No backend integration required - everything is defined in the configuration

### Important Notes

**Pricing Format:**
- All prices must be specified in USDC micro-units (6 decimal places)
- Example: `1000000n` = $1.00, `500000n` = $0.50, `10000n` = $0.01

**Contract Calls:**
- Use the standard Starknet `Call` format with `contractAddress`, `entrypoint`, and `calldata`
- Calls are executed in the order they appear in the `call` array for each item
- All calls across all items are combined into a single multicall transaction

**Error Handling:**
- If any contract call fails, the entire transaction is reverted
- Users are only charged if all contract calls execute successfully

## Starterpack Types

Cartridge Controller now supports a dual-path architecture for starterpacks, automatically detecting the type based on the ID format:

### Dual-Path Architecture

**Automatic Detection:**
- **Numeric IDs** (e.g., `12345`) → **Onchain Starterpacks** (smart contract-based)
- **String IDs** (e.g., `"beginner-pack-2024"`) → **Backend Starterpacks** (GraphQL-based)

This allows seamless integration of both traditional backend-managed starterpacks and new blockchain-native onchain starterpacks in a single interface.

### Backend Starterpacks (Traditional)
Backend starterpacks are managed via GraphQL and support multiple payment methods (credit card or cryptocurrency).
These typically include premium game assets, larger credit bundles, and exclusive items.
Cross-chain crypto payments are powered by Layerswap, and credit card payments are powered by Stripe.

**Features:**
- Custom StarterPack object configuration
- Cross-chain payments with automatic bridging
- Both paid and claimable variants
- Merkle drop claim support

### Onchain Starterpacks (New)
Onchain starterpacks are managed entirely via smart contracts on Starknet, providing a decentralized purchase experience.
Users purchase directly from a registry contract using payment tokens like USDC or ETH.

**Features:**
- Direct smart contract interaction
- Transparent on-chain pricing and fees
- Automatic balance checking before purchase
- Real-time supply tracking
- Protocol and referral fee support
- Payment token flexibility (USDC, ETH, etc.)

**Key Differences:**
- **Pricing**: Fetched directly from smart contract with transparent fee breakdown
- **Purchase Flow**: ERC-20 token approval + registry contract `issue` call
- **Supply**: Real-time supply tracking from blockchain state
- **Fees**: Protocol fees and referral fees handled on-chain
- **Payment**: Native token payments (displays in token amounts, e.g. "100.00 USDC")

### Paid Starterpacks
Both backend and onchain starterpacks support paid variants that require purchase through multiple payment methods.

**Backend Paid Starterpacks:**
- Support credit card payments via Stripe
- Support crypto payments with cross-chain bridging via Layerswap
- Configurable pricing in USD with automatic conversion

**Onchain Paid Starterpacks:**
- Direct payment using ERC-20 tokens (USDC, ETH, etc.)
- Smart contract handles pricing and fee calculation
- Transparent fee breakdown (base price + protocol fee + referral fee)
- Automatic balance checking with insufficient funds warnings

### Claimable Starterpacks
Free starterpacks that users can claim based on eligibility criteria. Currently, only backend starterpacks support claimable variants.

**Backend Claimable Starterpacks:**
- **No payment required**: Users can claim them for free
- **Eligibility checking**: System verifies if user meets claim requirements
- **Collection showcase**: Display supported game collections with platform indicators
- **Mint limits**: May have limited quantities or per-user claiming restrictions
- **Cross-chain Claims**: Claims can originate from multiple blockchain networks and be delivered to Starknet

The claiming flow automatically determines eligibility and guides users through the appropriate network selection for receiving their assets.

#### Merkle Drop Claims

Claimable starterpacks use **Merkle Drop** technology to enable secure, verifiable claims across multiple blockchain networks.
This system allows users to claim assets that were originally distributed on other networks and receive them in their Cartridge account on Starknet.

**How Merkle Drop Claims Work:**

1. **Eligibility Verification**: The system checks if the user's external wallet address is included in the merkle tree for the starterpack
2. **Cryptographic Proof**: Claims are validated using merkle proofs that mathematically prove eligibility without revealing the entire distribution list
3. **Cross-chain Signature**: For EVM-based claims, users must sign a message with their external wallet to prove ownership
4. **Forwarder Contract**: Claims are processed through a forwarder contract on Starknet that verifies the proof and signature before distributing assets

**Supported Networks for Claims:**

- **Starknet**: Native claims without additional signature requirements
- **Ethereum Mainnet/Testnet**: MetaMask, Rabby, Coinbase Wallet supported
- **Base Mainnet/Testnet**: MetaMask, Rabby, Coinbase Wallet supported
- **Arbitrum One/Testnet**: MetaMask, Rabby, Coinbase Wallet supported
- **Optimism Mainnet/Testnet**: MetaMask, Rabby, Coinbase Wallet supported

:::note
Solana payment functionality is currently disabled and will be re-enabled in a future update.
:::

## Purchase and Claim Flows

### Purchase Flow (Paid Starterpacks)

The purchase process varies based on starterpack type:

#### Backend Starterpack Purchase Flow

1. **Item Selection**: User selects backend starterpack (string ID)
2. **Payment Method & Network Selection**: Choose from all available options on a unified screen:
   - **Credit Card**: Direct fiat payment via Stripe
   - **Cryptocurrency**: Pay with Crypto from Ethereum, Base, Arbitrum, or Optimism
3. **Wallet Connection**: Connect external wallet with automatic chain switching (supported on MetaMask, Rabby, Base, and WalletConnect)
4. **Cross-Chain Bridging**: Layerswap automatically handles token bridging to Starknet if needed
5. **Transaction Processing**: Complete payment through selected method with automatic bridging fees calculation
6. **Confirmation**: Receive purchase confirmation and assets in your Cartridge account

#### Onchain Starterpack Purchase Flow

1. **Item Selection**: User selects onchain starterpack (numeric ID)
2. **Smart Contract Data**: System fetches metadata, pricing, and fee breakdown from registry contract
3. **Balance Check**: Automatic verification of user's payment token balance
4. **Wallet Selection**: Choose wallet (uses wallet address for Argent/Braavos, controller address otherwise)
5. **Token Approval**: Approve payment token for exact transfer amount to registry contract
6. **Registry Purchase**: Call `issue` function on starterpack registry contract
7. **Transaction Confirmation**: Wait for Starknet transaction confirmation with explorer link
8. **Asset Delivery**: Receive starterpack assets directly from smart contract execution

## Cross-Chain Bridging with Layerswap

Cartridge uses Layerswap to enable seamless cross-chain payments for **backend starterpacks**. When users pay with cryptocurrency from supported networks (Ethereum, Base, Arbitrum, or Optimism), Layerswap automatically bridges the tokens to your Cartridge account on Starknet.

:::note
Onchain starterpacks use direct Starknet payments and do not require cross-chain bridging.
:::

### Wallet Chain Switching Behavior

During the payment process, Controller attempts to automatically switch connected wallets to the optimal chain for the transaction:

- **MetaMask, Rabby, Base, WalletConnect**: Support automatic chain switching via the `wallet_switchStarknetChain` API
- **Braavos**: Does not support automatic chain switching and will remain on the currently connected chain

If a wallet doesn't support chain switching, users can manually switch chains within their wallet before completing the transaction.

### Fee Structure

Fee structures vary based on starterpack type:

#### Backend Starterpack Fees

Cryptocurrency payments for backend starterpacks include several fee components:

- **Base Cost**: The actual purchase amount (starterpack or credit value)
- **Cartridge Processing Fee**: 2.5% service fee
- **Layerswap Bridging Fee**: Variable fee based on source network and token (typically 0.1-0.5%)
- **Network Gas Fees**: Standard blockchain transaction fees (paid separately by user)

#### Onchain Starterpack Fees

Onchain starterpack fees are handled entirely on-chain with transparent calculation:

- **Base Price**: The starterpack's base cost (fetched from smart contract)
- **Protocol Fee**: Fee charged by the starterpack protocol
- **Referral Fee**: Fee paid to referrers (if applicable)
- **Network Gas Fees**: Standard Starknet transaction fees

The total cost including all fees is displayed upfront before payment confirmation for both types.

#### NFT Marketplace Fees

For ERC721 and ERC1155 marketplace transactions, additional fees apply:

- **Marketplace Fee**: Variable fee set by the marketplace platform
- **Creator Royalties**: Fees paid to the original creator of the NFT (if applicable)
- **Client Fee**: Processing fee calculated using configurable numerator/denominator ratios, automatically applied to marketplace transactions

These fees are transparently displayed in the purchase interface before transaction confirmation, including percentage breakdowns and total amounts.

### Claim Flow (Free Starterpacks)

The claiming process is currently available for backend starterpacks only and follows these steps:

1. **Starterpack Selection**: User opens a claimable backend starterpack (string ID)
2. **Eligibility Check**: System automatically verifies claim eligibility and mint limits
3. **Collection Preview**: View supported game collections and platform compatibility
4. **Network & Wallet Selection**: Choose the blockchain network where your claim originated and connect the corresponding wallet
5. **Signature Verification**: For EVM-based claims, sign a verification message with your external wallet to prove ownership
6. **Merkle Proof Validation**: System validates your claim using cryptographic merkle proofs
7. **Claim Processing**: Complete the free claim transaction via the forwarder contract on Starknet
8. **Confirmation**: Receive claim confirmation and assets in your Cartridge account

:::note
Onchain starterpacks do not currently support claimable variants and are always paid purchases.
:::

### Getting Help

If you encounter issues with purchase integration:
- Check the browser console for detailed error messages
- Verify your Controller setup matches the [getting started guide](/controller/getting-started.mdx)
- Ensure you're using the latest version of the Controller SDK
- Review [external wallet setup](/controller/signer-management.md) for wallet-related issues

## Next Steps

- Learn about [Session Keys](/controller/sessions.md) for gasless gaming experiences
- Explore [Controller Configuration](/controller/configuration.md) options
- Set up [External Wallet Integration](/controller/signer-management.md)
- Review [Paymaster Configuration](/slot/paymaster.md) for gasless transactions
