---
description: Explore the configuration options available for Cartridge Controller, including chain settings, session management, and theme customization.
title: Controller Configuration
---

# Configuration

Controller provides several configuration options related to chains, sessions, and theming.

## ControllerOptions

```typescript
export type ControllerOptions = {
    // Provider options
    chains: [
        { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
        { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
    ],
    defaultChainId: constants.StarknetChainId.SN_SEPOLIA,

    // Session options 
    policies?: SessionPolicies;  // Session policies
    propagateSessionErrors?: boolean;  // Propagate transaction errors back to caller

    // Preset options
    preset?: string;  // The preset name
};
```

The configuration options are organized into several categories:

-   **Provider Options**: Core RPC configuration
-   [**Session Options**](/controller/sessions.md): Session and transaction related settings
-   [**Preset Options**](/controller/presets.md): Configure a custom theme and verified session policies using Presets
