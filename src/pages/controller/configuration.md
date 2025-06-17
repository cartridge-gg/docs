---
description: Explore the configuration options available for Cartridge Controller, including chain settings, session management, and theme customization.
title: Controller Configuration
---

# Configuration

Controller provides several configuration options related to chains, sessions, and theming.

## ControllerOptions

```typescript
export type ControllerOptions = {
    // RPC configuration
    rpc?: string;  // RPC endpoint URL (defaults to Cartridge RPC)
    
    // Chain configuration
    chainId?: string;  // Chain ID (defaults to Sepolia)
    
    // Session options 
    policies?: SessionPolicies;  // Session policies for pre-approved transactions
    propagateSessionErrors?: boolean;  // Propagate transaction errors back to caller
    
    // Customization options
    preset?: string;  // Preset name for custom themes and verified policies
    slot?: string;  // Slot project name for custom indexing
    
    // Advanced options
    redirectUrl?: string;  // Custom redirect URL after session creation
};
```

The configuration options are organized into several categories:

-   **RPC & Chain Options**: Core network configuration and chain settings
-   [**Session Options**](/controller/sessions.md): Session policies and transaction-related settings
-   **Customization Options**: [Presets](/controller/presets.md) for themes and verified policies, [Slot](/controller/inventory.md) for custom indexing
-   **Advanced Options**: Additional configuration for specialized use cases
