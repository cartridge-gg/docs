# Configuration

Controller provides several configuration options related to chains, sessions, and theming.

## ControllerOptions

```typescript
export type ControllerOptions = {
    // Provider options
    rpc: string;  // The URL of the RPC
    
    // Session options 
    policies?: Policy[];  // Session policies
    propagateSessionErrors?: boolean;  // Propagate transaction errors back to caller
    
    // Theme options
    theme?: string;  // The theme name
    colorMode?: "light" | "dark";  // The color mode
};
```

The configuration options are organized into several categories:

-   **Provider Options**: Core RPC configuration
-   **Session Options**: Session and transaction related settings
-   **Theme Options**: Visual customization settings

See the [Theming](./theming.md) section for details on theme configuration.
