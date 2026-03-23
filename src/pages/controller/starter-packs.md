---
showOutline: 1
description: Learn how to integrate starter packs in your game - pre-configured bundles of game assets and credits that players can purchase or claim with streamlined payment flows across multiple blockchains.
title: Starter Packs
---

# Starter Packs

Starter packs are pre-configured bundles of game assets, NFTs, and in-game currency that provide a seamless onboarding and monetization experience for your players. Cartridge Controller makes it easy to offer both paid starter packs and free claimable packs with support for multiple payment methods across different blockchain networks.

## Overview

Starter packs enable you to:

- **Create Custom Bundles**: Configure packs with fungible tokens, NFTs, and on-chain items with automatic contract execution
- **Offer Paid Packs**: Accept payments via credit card (Stripe) or cryptocurrency across Ethereum, Base, Arbitrum, and Optimism
- **Enable Free Claims**: Distribute free packs using Merkle Drop technology with cross-chain eligibility verification
- **Flexible Configuration**: Build packs programmatically or reference pre-configured packs by ID
- **Multichain Payment Support**: Unified payment interface with automatic token bridging via Layerswap
- **Multiple Wallet Integration**: Support for popular wallets with automatic chain switching where supported
- **NFT Marketplace Support**: ERC721 and ERC1155 listing and purchase capabilities with integrated fee structure

## Quick Start

Opening a starter pack interface is straightforward:

```typescript
import Controller from "@cartridge/controller";

const controller = new Controller();

// Open an existing starter pack by ID (works for both paid and claimed packs)
controller.openStarterPack("starterpack-id-123");

// Numeric IDs are also supported for onchain starter packs
controller.openStarterPack(42);
```

## API Reference

### openStarterPack(starterpackId: string | number, options?: StarterpackOptions)

Opens the starter pack interface for a specific starter pack bundle. This method works for both paid starter packs (requiring purchase) and claimed starter packs (that can be claimed based on eligibility).

```typescript
controller.openStarterPack(starterpackId: string | number, options?: StarterpackOptions);
```

**Parameters:**
- `starterpackId` (string | number): The starter pack ID. String IDs are used for claimed packs, numeric IDs for onchain packs
- `options` (StarterpackOptions, optional): Configuration options for the starter pack

**StarterpackOptions:**
- `preimage` (string, optional): The preimage to use for claimed starter packs
- `onPurchaseComplete` (function, optional): Callback fired after the Play button closes the starter pack modal

**Returns:** `void`

**Usage Examples:**

```typescript
// Open a paid starter pack for purchase
const handleBuyStarterpack = () => {
  controller.openStarterPack("beginner-pack-2024");
};

// Open a starter pack with play callback
const handleBuyWithCallback = () => {
  controller.openStarterPack("beginner-pack-2024", {
    onPurchaseComplete: () => {
      console.log("Starter pack purchase completed!");
      // Redirect to game or refresh inventory
    }
  });
};

// Open a free claimable starter pack with preimage
const handleClaimStarterpack = () => {
  controller.openStarterPack("free-welcome-pack-2024", {
    preimage: "claim-preimage-data"
  });
};

// Open an onchain starter pack using numeric ID
const handleOnchainStarterpack = () => {
  controller.openStarterPack(42); // Numeric ID for onchain pack
};
```

## Starter Pack Configuration

Starter packs are registered onchain through the [Arcade starter pack registry](/arcade/starter-packs) and referenced by numeric ID.
The Controller SDK provides a simple interface to open these registered packs.
To create your own starter pack, see [Creating Starter Packs](/arcade/starter-packs).

### Starter Pack Types

**Claimed Starter Packs (String IDs):**
- Use UUID-like string identifiers (e.g., "free-welcome-pack-2024")
- Typically free packs distributed via merkle drops
- Support cross-chain claiming from various networks

**Onchain Starter Packs (Numeric IDs):**
- Use numeric identifiers (e.g., 42)
- Paid packs with smart contract execution
- Support multiple payment methods and automatic contract calls

### Key Features

- **Pre-configured**: Packs are set up through the Cartridge platform with predefined items and pricing
- **Cross-chain Support**: Automatic token bridging and multi-network compatibility
- **Smart Contract Integration**: Automatic execution of associated contract calls after payment
- **Unified Interface**: Single method works for both paid and claimed packs
- **Platform Managed**: No need to define complex item structures in your code
- **Additional Payment Tokens**: Support for custom payment options beyond default ETH, STRK, and USDC through starter pack metadata configuration

### Paid Starter Packs
Paid starter packs require purchase and support multiple payment methods (credit card or cryptocurrency).
These typically include premium game assets, larger credit bundles, and exclusive items.
Cross-chain crypto payments are powered by Layerswap, and credit card payments are powered by Stripe.

### Claimed Starter Packs
Free starter packs that users can claim based on eligibility criteria. These starter packs:
- **No payment required**: Users can claim them for free
- **Eligibility checking**: System verifies if user meets claim requirements
- **Collection showcase**: Display supported game collections with platform indicators
- **Mint limits**: May have limited quantities or per-user claiming restrictions
- **Cross-chain Claims**: Claims can originate from multiple blockchain networks and be delivered to Starknet

The claiming flow automatically determines eligibility and guides users through the appropriate network selection for receiving their assets.

#### Merkle Drop Claims

Claimable starter packs use **Merkle Drop** technology to enable secure, verifiable claims across multiple blockchain networks.
This system allows users to claim assets that were originally distributed on other networks and receive them in their Cartridge account on Starknet.

**DevConnect Integration**: Cartridge supports DevConnect booster pack claims through the Merkle claim system, allowing users to claim DevConnect rewards using preimage-derived EVM addresses. This enables seamless cross-chain reward distribution for DevConnect participants.

**How Merkle Drop Claims Work:**

1. **Eligibility Verification**: The system checks if the user's external wallet address is included in the merkle tree for the starter pack
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

### Purchase Flow (Paid Starter Packs)

The purchase process follows these steps:

1. **Item Selection**: User selects starter pack or credit amount
2. **Streamlined Checkout**: Improved onchain starter pack purchase flow with direct navigation, removing intermediate screens and defaulting to controller wallet for faster transactions
3. **Wallet Selection Drawer**: Enhanced onchain checkout with inline slide-up drawer for wallet selection, replacing navigation-based flow for more seamless UX
4. **Payment Method & Network Selection**: Choose from all available options on a unified screen:
   - **Credit Card**: Direct fiat payment via Stripe
   - **Cryptocurrency**: Pay with Crypto from Ethereum, Base, Arbitrum, or Optimism
   - **Coinbase Onramp**: Integrated fiat-to-crypto onramp with automatic client IP detection for order creation and transaction queries
5. **Identity Verification** (Stripe only): First-time Stripe users must verify their identity by providing first name, last name, and phone number. Verified users skip directly to payment.
6. **Wallet Connection**: Connect external wallet with automatic chain switching (supported on MetaMask, Rabby, Base, and WalletConnect)
7. **Cross-Chain Bridging**: Layerswap automatically handles token bridging to Starknet if needed
8. **Transaction Processing**: Complete payment through selected method with automatic bridging fees calculation
9. **Confirmation**: Receive purchase confirmation and assets in your Cartridge account

## Cross-Chain Bridging with Layerswap

Cartridge uses Layerswap to enable seamless cross-chain payments. When users pay with cryptocurrency from supported networks (Ethereum, Base, Arbitrum, or Optimism), Layerswap automatically bridges the tokens to your Cartridge account on Starknet.

### Wallet Chain Switching Behavior

During the payment process, Controller attempts to automatically switch connected wallets to the optimal chain for the transaction:

- **MetaMask, Rabby, Base, WalletConnect**: Support automatic chain switching via the `wallet_switchStarknetChain` API
- **Braavos**: Does not support automatic chain switching and will remain on the currently connected chain

If a wallet doesn't support chain switching, users can manually switch chains within their wallet before completing the transaction.

### Fee Structure

Cryptocurrency payments include several fee components:

- **Base Cost**: The actual purchase amount (starter pack or credit value)
- **Layerswap Bridging Fee**: Variable fee based on source network and token (typically 0.1-0.5%)
- **Network Gas Fees**: Standard blockchain transaction fees (paid separately by user)

The total cost including all fees is displayed upfront before payment confirmation.

#### NFT Marketplace Fees

For ERC721 and ERC1155 marketplace transactions, additional fees apply:

- **Marketplace Fee**: Variable fee set by the marketplace platform
- **Creator Royalties**: Fees paid to the original creator of the NFT (if applicable)
- **Client Fee**: Processing fee calculated using configurable numerator/denominator ratios, automatically applied to marketplace transactions

These fees are transparently displayed in the purchase interface before transaction confirmation, including percentage breakdowns and total amounts.

### Claim Flow (Free Starter Packs)

The claiming process follows these steps:

1. **Starter Pack Selection**: User opens a claimable starter pack
2. **Eligibility Check**: System automatically verifies claim eligibility and mint limits
3. **Collection Preview**: View supported game collections and platform compatibility
4. **Network & Wallet Selection**: Choose the blockchain network where your claim originated and connect the corresponding wallet
5. **Signature Verification**: For EVM-based claims, sign a verification message with your external wallet to prove ownership
6. **Merkle Proof Validation**: System validates your claim using cryptographic merkle proofs
7. **Claim Processing**: Complete the free claim transaction via the forwarder contract on Starknet
8. **Confirmation**: Receive claim confirmation and assets in your Cartridge account

## Gasless Transactions

Starter packs enable gasless gaming experiences through integration with [session policies](/controller/sessions).
When properly configured, users can receive and interact with their starter pack assets without paying gas fees for each transaction.

## Credit Purchases

In addition to starter packs, Controller provides direct credit purchase functionality for topping up user accounts with credits for gasless transactions and other platform services.

### openPurchaseCredits()

Opens the credit purchase interface where users can buy credits using the same payment methods available for starter packs (credit card or cryptocurrency).

```typescript
controller.openPurchaseCredits();
```

**Parameters:** None

**Returns:** `void`

**Usage Example:**
```typescript
// Add a "Buy Credits" button in your game's UI
const handleBuyCredits = () => {
  controller.openPurchaseCredits();
};
```

Credits purchased through this interface use the same unified payment flow as starter packs, including support for multiple blockchains, automatic token bridging, and both fiat and crypto payment options.

## Getting Help

If you encounter issues with purchase integration:
- Check the browser console for detailed error messages
- Verify your Controller setup matches the [getting started guide](/controller/getting-started)
- Ensure you're using the latest version of the Controller SDK
- Review [external wallet setup](/controller/signer-management) for wallet-related issues

## Next Steps

- Learn about [Sessions](/controller/sessions) for gasless gaming experiences
- Explore [Controller Configuration](/controller/configuration) options
- Set up [External Wallet Integration](/controller/signer-management)
- Review [Paymaster Configuration](/slot/paymaster) for gasless transactions
