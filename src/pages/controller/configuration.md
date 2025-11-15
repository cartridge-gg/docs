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
    
    // Performance options
    lazyload?: boolean;  // When true, defer iframe mounting until connect() is called. Reduces initial load time and resource fetching
    
    // Keychain options
    url?: string;  // The URL of keychain
    origin?: string;  // The origin of keychain
    controller_redirect?: string;  // Redirect URL for standalone flow with preset support
    starterPackId?: string;  // The ID of the starter pack to use
    feeSource?: FeeSource;  // The fee source to use for execute from outside
    signupOptions?: AuthOptions;  // Signup options (order reflects UI. Group socials and wallets together)
    shouldOverridePresetPolicies?: boolean;  // When true, manually provided policies override preset policies. Default is false
    namespace?: string;  // The namespace to use to fetch trophies data from indexer
    tokens?: Tokens;  // The tokens to be listed on Inventory modal
    
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
- Programmatically switch chains for connected external wallets (MetaMask, Rabby, WalletConnect)

### Network Switching

Controller supports multiple methods for switching between different blockchain networks:

#### External Wallet Chain Switching

For external wallets, Controller supports programmatic chain switching through the `externalSwitchChain` method. This allows applications to request connected external wallets to switch to different blockchain networks seamlessly.

**Supported Wallets**: MetaMask, Rabby, Base, WalletConnect (desktop only)
**Not Supported**: Braavos (does not support the `wallet_switchStarknetChain` API)

> **Note**: Ethereum-based external wallets are only available on desktop browsers. Mobile devices automatically disable these wallets to provide better mobile user experience.

#### Dynamic RPC URL Override

The keychain interface supports dynamic RPC URL switching via URL parameters, allowing users to connect to different networks without page reloads:

```
https://x.cartridge.gg/?rpc_url=https://custom-rpc-endpoint.com
```

When an RPC URL parameter is provided, the keychain will:
- Detect the chain ID from the new RPC endpoint
- Recreate the controller instance with the new network configuration
- Update all network-related state without requiring a page reload

This feature is particularly useful for testing against development and staging environments and connecting to custom Starknet deployments.

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

## Performance Optimization

### Lazy Loading

The `lazyload` option allows you to defer iframe mounting until `connect()` is called. This can significantly reduce initial load time and prevent unnecessary resource fetching when the controller is instantiated but not immediately used.

**Example:**
```typescript
const controller = new Controller({
  lazyload: true, // Iframe is created only when connect() is called
  // ... other options
});

// No iframe is created yet - faster initial load
await controller.connect(); // Iframe is created and mounted now
```

**When to use lazy loading:**
- Applications where the controller might not be used immediately
- Performance-critical scenarios where reducing initial bundle execution time matters
- Mobile applications where resource conservation is important

**When not to use lazy loading:**
- Applications that need immediate controller availability
- When the slight delay during first connect() is unacceptable

## Configuration Categories

The configuration options are organized into several categories:

-   **Chain Options**: Core network configuration and chain settings
-   [**Session Options**](/controller/sessions.md): Session policies and transaction-related settings
-   **Performance Options**: Lazy loading and other performance optimizations
-   **Keychain Options**: Authentication, signup flow, and keychain-specific settings
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
- Cryptocurrency payments across multiple networks (Starknet, Base, Arbitrum, Optimism)
- Integration with popular wallets (Argent, Braavos, MetaMask, Rabby)

For detailed integration guidance, see the [Starter Packs](/controller/starter-packs.md) guide.
