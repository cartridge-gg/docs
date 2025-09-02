---
description: Learn how to integrate Cartridge Controller's purchase and monetization features, including starterpack purchases and credit transactions using multiple payment methods.
title: Purchase Integration
---

# Purchase Integration

Cartridge Controller provides built-in purchase functionality that enables seamless monetization for games and applications. The purchase system supports both traditional payment methods (credit cards) and cryptocurrency transactions across multiple blockchain networks.

## Overview

The purchase system includes:

- **Starterpack Purchases**: Pre-configured bundles of game assets and credits with streamlined purchasing flow
- **Starterpack Claims**: Free starterpack bundles that users can claim based on eligibility, featuring collection support display
- **Credit Purchases**: Direct credit top-ups for gasless transactions  
- **Multichain Payment Support**: Accept payments on Starknet, Ethereum (Base), and Solana with unified payment method selection
- **Multiple Wallet Integration**: Support for popular wallets across different ecosystems with chain switching capabilities
- **Unified Payment Interface**: Both fiat (credit card) and crypto payment options displayed on a single screen
- **NFT Marketplace Support**: ERC721 and ERC1155 listing and purchase capabilities with integrated client fee structure for enhanced marketplace functionality

## Quick Start

### Opening Purchase Flows

Controller provides simple methods to open purchase interfaces:

```typescript
import Controller from "@cartridge/controller";

const controller = new Controller();

// Open credit purchase flow
controller.openPurchaseCredits();

// Open starterpack purchase/claim flow (works for both paid and free starterpacks)
controller.openStarterPack("starterpack-id-123");
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

### openStarterPack(starterpackId: string)

Opens the starterpack interface for a specific starterpack bundle. This method works for both paid starterpacks (requiring purchase) and free starterpacks (that can be claimed based on eligibility).

```typescript
controller.openStarterPack(starterpackId: string);
```

**Parameters:**
- `starterpackId` (string): The unique identifier for the starterpack to purchase or claim

**Returns:** `void`

**Usage Examples:**
```typescript
// Offer paid starterpack to new players
const handleBuyStarterpack = () => {
  controller.openStarterPack("beginner-pack-2024");
};

// Offer free claimable starterpack
const handleClaimStarterpack = () => {
  controller.openStarterPack("free-welcome-pack-2024");
};
```

## Starterpack Types

### Paid Starterpacks
Paid starterpacks require purchase and support multiple payment methods (credit card or cryptocurrency). These typically include premium game assets, larger credit bundles, and exclusive items.

### Claimable Starterpacks
Free starterpacks that users can claim based on eligibility criteria. These starterpacks:
- **No payment required**: Users can claim them for free
- **Eligibility checking**: System verifies if user meets claim requirements
- **Collection showcase**: Display supported game collections with platform indicators
- **Mint limits**: May have limited quantities or per-user claiming restrictions

The claiming flow automatically determines eligibility and guides users through the appropriate network selection for receiving their assets.

## Supported Payment Methods

### Credit Card Payments

- Powered by Stripe for secure processing
- Supports major credit and debit cards
- Automatic currency conversion
- PCI-compliant payment handling

### Cryptocurrency Payments

The system supports crypto payments across multiple networks with cross-chain bridging powered by Layerswap:

#### Ethereum
- **Supported Wallets**: MetaMask, Rabby, Coinbase Wallet
- **Network**: Ethereum mainnet and Sepolia testnet
- **Assets**: ETH, USDC, and other ERC-20 tokens

#### Base L2
- **Supported Wallets**: MetaMask, Rabby, Coinbase Wallet
- **Network**: Base mainnet and testnet
- **Assets**: ETH, USDC, and other Base-compatible tokens

#### Arbitrum
- **Supported Wallets**: MetaMask, Rabby, Coinbase Wallet
- **Network**: Arbitrum One mainnet and Sepolia testnet
- **Assets**: ETH, USDC, and other Arbitrum-compatible tokens

#### Optimism
- **Supported Wallets**: MetaMask, Rabby, Coinbase Wallet
- **Network**: Optimism mainnet and Sepolia testnet
- **Assets**: ETH, USDC, and other Optimism-compatible tokens

#### Solana
- **Supported Wallets**: Phantom
- **Network**: Solana mainnet and devnet
- **Assets**: SOL, USDC, and other SPL tokens

#### Starknet
- **Supported Wallets**: Argent (native integration), Braavos
- **Network**: Starknet mainnet and testnets
- **Assets**: ETH, STRK, and other Starknet tokens

## Purchase and Claim Flows

### Purchase Flow (Paid Starterpacks)

The purchase process follows these steps:

1. **Item Selection**: User selects starterpack or credit amount
2. **Payment Method & Network Selection**: Choose from all available options on a unified screen:
   - **Credit Card**: Direct fiat payment via Stripe
   - **Cryptocurrency**: Pay with Crypto from Ethereum, Solana, Base, Arbitrum, or Optimism
3. **Wallet Connection**: Connect external wallet with automatic chain switching support
4. **Cross-Chain Bridging**: Layerswap automatically handles token bridging to Starknet if needed
5. **Transaction Processing**: Complete payment through selected method with automatic bridging fees calculation
6. **Confirmation**: Receive purchase confirmation and assets in your Cartridge account

## Cross-Chain Bridging with Layerswap

Cartridge uses Layerswap to enable seamless cross-chain payments. When users pay with cryptocurrency from supported networks (Ethereum, Base, Arbitrum, Optimism, or Solana), Layerswap automatically bridges the tokens to your Cartridge account on Starknet.

### Fee Structure

Cryptocurrency payments include several fee components:

- **Base Cost**: The actual purchase amount (starterpack or credit value)
- **Cartridge Processing Fee**: 2.5% service fee
- **Layerswap Bridging Fee**: Variable fee based on source network and token (typically 0.1-0.5%)
- **Network Gas Fees**: Standard blockchain transaction fees (paid separately by user)

The total cost including all fees is displayed upfront before payment confirmation.

#### NFT Marketplace Fees

For ERC721 and ERC1155 marketplace transactions, additional fees apply:

- **Marketplace Fee**: Variable fee set by the marketplace platform
- **Creator Royalties**: Fees paid to the original creator of the NFT (if applicable)
- **Client Fee**: Processing fee calculated using configurable numerator/denominator ratios, automatically applied to marketplace transactions

These fees are transparently displayed in the purchase interface before transaction confirmation, including percentage breakdowns and total amounts.

### Claim Flow (Free Starterpacks)

The claiming process follows these steps:

1. **Starterpack Selection**: User opens a claimable starterpack
2. **Eligibility Check**: System automatically verifies claim eligibility and mint limits
3. **Collection Preview**: View supported game collections and platform compatibility
4. **Network Selection**: Choose blockchain network for receiving claimed assets
5. **Claim Processing**: Complete the free claim transaction
6. **Confirmation**: Receive claim confirmation and assets

## Integration Examples

### Basic Starterpack Integration

```typescript
import Controller from "@cartridge/controller";

const controller = new Controller();

// Display both paid and free starterpack options
function StarterpackOffers() {
  return (
    <div className="starterpack-offers">
      {/* Paid starterpack */}
      <div className="starterpack-offer">
        <h3>Premium Welcome Pack</h3>
        <p>Get started with 1000 credits and exclusive items!</p>
        <button 
          onClick={() => controller.openStarterPack("premium-pack-2024")}
          className="buy-button"
        >
          Buy Welcome Pack - $9.99
        </button>
      </div>

      {/* Claimable starterpack */}
      <div className="starterpack-offer">
        <h3>Free Starter Pack</h3>
        <p>Claim your free starter bundle with game assets!</p>
        <button 
          onClick={() => controller.openStarterPack("free-pack-2024")}
          className="claim-button"
        >
          Claim Free Pack
        </button>
      </div>
    </div>
  );
}
```

### Credit Top-up Integration

```typescript
// Add credit purchase option to game UI
function CreditDisplay({ credits }: { credits: number }) {
  return (
    <div className="credit-display">
      <span>Credits: {credits}</span>
      <button 
        onClick={() => controller.openPurchaseCredits()}
        className="top-up-button"
      >
        + Add Credits
      </button>
    </div>
  );
}
```

### Conditional Purchase Offers

```typescript
// Show purchase options based on game state and user eligibility
function PurchaseIntegration({ 
  playerLevel, 
  credits, 
  hasClaimedFreePack 
}: { 
  playerLevel: number, 
  credits: number, 
  hasClaimedFreePack: boolean 
}) {
  const showPaidStarterpack = playerLevel >= 5; // Offer premium packs to experienced players
  const showFreeStarterpack = !hasClaimedFreePack && playerLevel < 3; // Free pack for new players
  const showCredits = credits < 100;

  return (
    <div className="purchase-options">
      {showFreeStarterpack && (
        <button onClick={() => controller.openStarterPack("free-beginner-pack")}>
          Claim Free Beginner Pack
        </button>
      )}

      {showPaidStarterpack && (
        <button onClick={() => controller.openStarterPack("premium-pack")}>
          Premium Pack ($9.99)
        </button>
      )}
      
      {showCredits && (
        <button onClick={() => controller.openPurchaseCredits()}>
          Buy Credits
        </button>
      )}
    </div>
  );
}
```

## Best Practices

### User Experience
- **Clear Value Proposition**: Clearly communicate what users receive with each purchase or claim
- **Strategic Timing**: Show purchase options at natural moments (low credits, level milestones)
- **Multiple Options**: Offer both individual credits and value bundles through starterpacks
- **Payment Choice**: Let users choose their preferred payment method
- **Free First**: Prioritize showing claimable starterpacks to new users before paid options
- **Eligibility Clarity**: Make it clear when starterpacks are free vs. paid
- **Collection Context**: Highlight which game collections/platforms are supported for claimed assets

### Integration Guidelines
- **Non-intrusive**: Don't block gameplay with purchase prompts
- **Contextual**: Show relevant purchase options based on user needs
- **Progressive**: Start with smaller purchases and gradually introduce larger bundles
- **Accessible**: Ensure purchase buttons are easily discoverable but not overwhelming

### Security Considerations
- **Client-side Only**: Purchase methods only open interfaces; no sensitive operations in frontend code
- **Secure Handling**: All payment processing happens within Controller's secure iframe
- **User Control**: Users maintain control over all payment authorizations

## Troubleshooting

### Common Issues

**Purchase interface doesn't open**
- Ensure Controller is properly initialized and connected
- Verify the user is authenticated
- Check browser console for any JavaScript errors

**Starterpack not found**
- Verify the starterpack ID exists and is active
- Check that the starterpack is available in the current environment (mainnet/testnet)

**Claim eligibility issues**
- Verify the user meets all claim requirements for the starterpack
- Check if the user has already claimed their maximum allowed starterpacks
- Ensure the starterpack has remaining supply if there are mint limits

**Wallet connection fails during crypto payment**
- Ensure the wallet extension is installed and unlocked
- Verify the wallet supports the selected network (MetaMask, Rabby, and Coinbase Wallet for EVM chains; Phantom for Solana)
- Check that the wallet is connected to the correct network (mainnet vs testnet)
- Try refreshing the page and reconnecting the wallet

**Cross-chain bridging issues**
- Ensure sufficient token balance on the source network for both the purchase amount and bridging fees
- Verify the selected token is supported on the source network (ETH, USDC commonly supported)
- Check that Layerswap bridging is available for the selected network pair
- Allow additional time for cross-chain transactions to complete (typically 5-15 minutes)

**Payment processing errors**
- For credit card issues, users should check their card details and limits
- For crypto payments, verify network connectivity and sufficient balance for gas fees plus purchase amount
- Ensure the user completes the full payment flow without closing the interface
- If bridging fails, the transaction may need to be retried or completed on a different network

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