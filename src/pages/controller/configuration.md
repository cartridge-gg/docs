---
description: Explore the configuration options available for Cartridge Controller, including chain settings, session management, and theme customization.
title: Controller Configuration
---

# Configuration

Controller provides several configuration options related to chains, sessions, and theming.

## ControllerOptions

```typescript
export type Chain = {
  rpcUrl: string;
};

export type ControllerOptions = {
    // Chain configuration
    chains?: Chain[];  // Custom RPC endpoints (takes precedence over default chains)
    defaultChainId?: string;  // Default chain to use (hex encoded). If using Starknet React, this gets overridden by the same param in StarknetConfig
    
    // Session options 
    policies?: SessionPolicies;  // Optional: Session policies for pre-approved transactions
    propagateSessionErrors?: boolean;  // Propagate transaction errors back to caller
    
    // Customization options
    preset?: string;  // Preset name for custom themes and verified policies
    slot?: string;  // Slot project name for custom indexing
};
```

## Chain Configuration

Controller provides default Cartridge RPC endpoints for Starknet mainnet and sepolia networks:
- `https://api.cartridge.gg/x/starknet/mainnet`
- `https://api.cartridge.gg/x/starknet/sepolia`

When you provide custom chains via the `chains` option, they take precedence over the default Cartridge chains if they specify the same network. This allows you to:
- Use custom RPC endpoints for mainnet or sepolia
- Add support for additional networks (like Slot katana instances)
- Override default chain configurations
- Programmatically switch chains for connected external wallets (Braavos, MetaMask, Rabby, WalletConnect)

### External Wallet Chain Switching

Controller supports programmatic chain switching for external wallets through the `externalSwitchChain` method. This allows applications to request connected external wallets to switch to different blockchain networks seamlessly.

**Example:**
```typescript
const controller = new Controller({
  chains: [
    { rpcUrl: "https://api.cartridge.gg/x/my-game/sepolia" }, // Overrides default sepolia
    { rpcUrl: "http://localhost:5050" }, // Adds local development chain
  ],
  chainId: constants.StarknetChainId.SN_SEPOLIA,
});
```

## Configuration Categories

The configuration options are organized into several categories:

-   **Chain Options**: Core network configuration and chain settings
-   [**Session Options**](/controller/sessions.md): Session policies and transaction-related settings
-   **Customization Options**: [Presets](/controller/presets.md) for themes and verified policies, [Slot](/controller/inventory.md) for custom indexing

## When to Use Policies

**Policies are optional** in Cartridge Controller. Choose based on your application's needs:

### Use Policies When:
- Building games that need frequent, seamless transactions
- You want gasless transactions via Cartridge Paymaster
- Users should not be interrupted with approval prompts during gameplay
- You need session-based authorization for better UX

### Skip Policies When:
- Building simple applications with occasional transactions
- Manual approval for each transaction is acceptable
- You don't need gasless transaction capabilities
- You want minimal setup complexity

```typescript
// Without policies - simple setup, manual approvals
const simpleController = new Controller();

// With policies - session-based, gasless transactions
const sessionController = new Controller({
  policies: {
    // ... policy definitions
  }
});
```

## Purchase Methods

Controller includes built-in methods for opening purchase interfaces:

### openPurchaseCredits()

Opens the credit purchase flow, allowing users to buy credits for gasless transactions and platform services.

```typescript
controller.openPurchaseCredits();
```

### openStarterPack(starterpackId: string)

Opens the starterpack purchase interface for a specific bundle.

```typescript
controller.openStarterPack("starterpack-id-123");
```

Both methods support:
- Credit card payments via Stripe
- Cryptocurrency payments across multiple networks (Starknet, Base, Solana)
- Integration with popular wallets (Argent, Braavos, MetaMask, Rabby, Phantom)

For detailed integration guidance, see the [Purchase Integration](/controller/purchasing.md) guide.
