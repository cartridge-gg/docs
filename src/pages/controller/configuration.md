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
    chains?: Chain[];  // Custom RPC endpoints for slot katana instances
    defaultChainId?: string;  // Default chain to use (hex encoded). If using Starknet React, this gets overridden by the same param in StarknetConfig
    
    // Session options 
    policies?: SessionPolicies;  // Session policies for pre-approved transactions
    propagateSessionErrors?: boolean;  // Propagate transaction errors back to caller
    
    // Customization options
    preset?: string;  // Preset name for custom themes and verified policies
    slot?: string;  // Slot project name for custom indexing
};
```

The configuration options are organized into several categories:

-   **Chain Options**: Core network configuration and chain settings
-   [**Session Options**](/controller/sessions.md): Session policies and transaction-related settings
-   **Customization Options**: [Presets](/controller/presets.md) for themes and verified policies, [Slot](/controller/inventory.md) for custom indexing
