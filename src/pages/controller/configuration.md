---
showOutline: 1
description: Explore the configuration options available for Cartridge Controller, including chain settings, session management, and theme customization.
title: Controller Configuration
---

# Configuration

Cartridge Controller provides several configuration options related to chains, sessions, and theming.

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
    propagateSessionErrors?: boolean;  // Propagate transaction errors back to caller instead of showing keychain UI
    errorDisplayMode?: "modal" | "notification" | "silent";  // How to display transaction/execution errors. Defaults to "modal"
    
    // Performance options
    lazyload?: boolean;  // When true, defer iframe mounting until connect() is called. Reduces initial load time and resource fetching
    
    // Keychain options
    url?: string;  // The URL of keychain
    origin?: string;  // The origin of keychain
    starterPackId?: string;  // The ID of the starter pack to use
    feeSource?: FeeSource;  // The fee source to use for execute from outside
    signupOptions?: AuthOptions;  // Signup options (order reflects UI. Group socials and wallets together). With one option configured, submit buttons show branded styling
    shouldOverridePresetPolicies?: boolean;  // When true, manually provided policies override preset policies. Default is false
    namespace?: string;  // The namespace to use to fetch trophies data from indexer
    tokens?: Tokens;  // The tokens to be listed on Inventory modal
    
    // Customization options
    preset?: string;  // Preset name for custom themes and verified policies
    slot?: string;  // Slot project name for custom indexing
};
```

:::warning
**Policy Precedence Behavior:**

When both `preset` and `policies` are provided:
- If `shouldOverridePresetPolicies: true` → uses manual policies
- If preset has policies for the current chain → uses preset policies (ignores manual policies)
- If preset has no policies for the current chain → falls back to manual policies

To guarantee manual policies take precedence, set `shouldOverridePresetPolicies: true`.
:::

## Chain Configuration

Cartridge Controller provides default Cartridge RPC endpoints for Starknet mainnet and sepolia networks:
- `https://api.cartridge.gg/x/starknet/mainnet`
- `https://api.cartridge.gg/x/starknet/sepolia`

When you provide custom chains via the `chains` option, they take precedence over the default Cartridge chains if they specify the same network.
This allows you to:
- Use custom RPC endpoints for mainnet or sepolia
- Add support for additional networks (like Slot katana instances)
- Override default chain configurations
- Programmatically switch chains for connected external wallets (MetaMask, Rabby, WalletConnect)

### Network Switching

Cartridge Controller supports multiple methods for switching between different blockchain networks:

#### External Wallet Chain Switching

For external wallets, Cartridge Controller supports programmatic chain switching through the `externalSwitchChain` method.
This allows applications to request connected external wallets to switch to different blockchain networks seamlessly.

**Supported Wallets**: MetaMask, Rabby, Base, WalletConnect (desktop only)
**Not Supported**: Braavos (does not support the `wallet_switchStarknetChain` API)

> **Note**: Ethereum-based external wallets are only available on desktop browsers.
> Mobile devices automatically disable these wallets to provide better mobile user experience.

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

The `lazyload` option allows you to defer iframe mounting until `connect()` is called.
This can significantly reduce initial load time and prevent unnecessary resource fetching when the controller is instantiated but not immediately used.

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

## Error Handling

### Propagate Session Errors

The `propagateSessionErrors` option controls how contract execution errors are handled when using session-based transactions.
When enabled, errors are returned directly to your application instead of showing the manual approval modal in the keychain.

For detailed configuration, see the [Session Policies documentation](/controller/sessions.md#error-propagation).

### Error Display Modes

Cartridge Controller provides configurable error handling through the `errorDisplayMode` option, allowing you to control how transaction and execution errors are presented to users.
This gives you fine-grained control over the user experience during error scenarios.

#### Available Modes

**Modal (Default)**

The default error handling behavior that displays errors in a modal dialog:

```typescript
const controller = new Controller({
  errorDisplayMode: "modal", // Can be omitted since this is the default
});
```

**Behavior:**
- Displays transaction errors in a modal overlay
- Blocks user interaction until dismissed
- Provides detailed error information
- Best for applications where users need to understand and resolve errors

**Notification**

Displays errors as clickable toast notifications:

```typescript
const controller = new Controller({
  errorDisplayMode: "notification",
});
```

**Behavior:**
- Shows errors as [toast notifications](/controller/toast-notifications)
- Non-blocking - users can continue interacting with the application
- Auto-dismisses after a few seconds
- Clickable for more details
- Best for applications where errors shouldn't interrupt gameplay flow

**Silent**

Suppresses error UI and only logs errors to the console:

```typescript
const controller = new Controller({
  errorDisplayMode: "silent",
});
```

**Behavior:**
- No visual error display to users
- Errors are logged to the browser console
- Application must handle error feedback through other means
- Best for applications with custom error handling or where errors are handled programmatically

#### Special Cases

Certain errors that require user interaction (such as session refresh or manual execution approval) **always show modal UI** regardless of the `errorDisplayMode` setting.
This ensures critical authentication and approval flows are not bypassed.

Examples of errors that always show modals:
- Session refresh required
- Manual execution approval needed
- Authentication failures

#### Error Handling Examples

**Gaming Application with Non-Blocking Errors:**

```typescript
const gameController = new Controller({
  errorDisplayMode: "notification", // Don't interrupt gameplay
  policies: {
    // Game-specific policies
  },
});

// Transaction errors appear as toast notifications
// Players can continue playing while being aware of issues
```

**Financial Application with Detailed Error Handling:**

```typescript
const financeController = new Controller({
  errorDisplayMode: "modal", // Show detailed errors
});

// Critical transaction errors require user acknowledgment
// Users must understand what went wrong before proceeding
```

**Custom Error Handling Application:**

```typescript
const customController = new Controller({
  errorDisplayMode: "silent",
  propagateSessionErrors: true, // Enable error propagation
});

// Handle errors programmatically
try {
  await customController.account.execute(calls);
} catch (error) {
  // Custom error handling logic
  showCustomErrorUI(error);
}
```

#### Integration with Toast Notifications

When using `errorDisplayMode: "notification"`, errors are displayed using Cartridge Controller's built-in [toast notification system](/controller/toast-notifications).
This provides:

- Consistent styling with your controller preset
- Cross-iframe compatibility
- Automatic positioning and duration management
- Integration with other game notifications

#### Error Display Behavior

The error display behavior depends on the combination of `propagateSessionErrors` and `errorDisplayMode`:

| `propagateSessionErrors` | `errorDisplayMode` | Behavior |
|-------------------------|-------------------|----------|
| `true` | Any | Errors are always rejected immediately, no UI shown |
| `false` (default) | `modal` | Opens controller modal for error handling |
| `false` | `notification` | Shows clickable toast notification |
| `false` | `silent` | No UI, errors logged to console |

## Configuration Categories

The configuration options are organized into several categories:

-   **Chain Options**: Core network configuration and chain settings
-   [**Session Options**](/controller/sessions.md): Session policies, transaction-related settings, and error handling
-   **Performance Options**: Lazy loading and other performance optimizations
-   **Keychain Options**: Authentication, signup flow, and keychain-specific settings
-   **Customization Options**: [Presets](/controller/presets.md) for themes and verified policies, [Slot](/controller/inventory.md) for custom indexing

## When to Use Policies

**Policies are optional** in Cartridge Controller.
Choose based on your application's needs:

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

## Dynamic Authentication Options

Cartridge Controller supports dynamic authentication configuration on a per-connection basis.
This enables multiple branded authentication flows while using a single Controller instance.

### Per-Connection signupOptions Override

The `connect()` method now accepts an optional `signupOptions` parameter that overrides the constructor defaults:

```typescript
import Controller from "@cartridge/controller";

const controller = new Controller({
  signupOptions: ["webauthn", "google", "discord"] // Default options
});

// Use default signupOptions
const account1 = await controller.connect();

// Override with specific options for branded flows
const account2 = await controller.connect(["phantom-evm"]);
const account3 = await controller.connect(["google"]);
const account4 = await controller.connect(["discord"]);
```

### ControllerConnector Dynamic Options

The `ControllerConnector` also supports dynamic authentication options:

```typescript
import { ControllerConnector } from "@cartridge/connector";

const connector = new ControllerConnector({
  signupOptions: ["webauthn", "google", "discord"] // Default options
});

// Use default options
await connector.connect();

// Override with specific options and chain hint
await connector.connect({
  signupOptions: ["phantom-evm"],
  chainIdHint: BigInt(constants.StarknetChainId.SN_MAIN)
});
```

### Use Cases

Dynamic authentication options enable several powerful patterns:

**Branded Authentication Buttons**
```typescript
// Create multiple specific authentication flows
<button onClick={() => controller.connect(["phantom-evm"])}>
  Continue with Phantom
</button>

<button onClick={() => controller.connect(["google"])}>
  Continue with Google  
</button>

<button onClick={() => controller.connect(["discord"])}>
  Continue with Discord
</button>
```

**Platform-Specific Authentication**
```typescript
// Mobile-optimized authentication (remove external wallets)
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
const authOptions = isMobile 
  ? ["webauthn", "google", "discord"]
  : ["webauthn", "google", "discord", "metamask", "walletconnect"];

await controller.connect(authOptions);
```

**Conditional Authentication Flows**
```typescript
// Different options based on user preferences or game context
const isNewUser = !localStorage.getItem("returning_user");
const authOptions = isNewUser
  ? ["google", "discord"] // Simplified for first-time users
  : ["webauthn", "google", "discord", "metamask"]; // All options for experienced users

await controller.connect(authOptions);
```

### Benefits

- **Single Instance**: Use one Controller/Connector for multiple authentication methods
- **Branded UI**: Create specific authentication buttons for different providers  
- **Flexible UX**: Adapt authentication options based on context or user preferences
- **Override Capability**: Per-connection options override constructor defaults

## Branded Submit Buttons

When `signupOptions` contains only a single authentication method (either in constructor or dynamically via `connect()`), Cartridge Controller automatically displays branded submit buttons with:

- **Signer icon**: Visual representation of the authentication method (e.g., Phantom icon, Google icon)
- **Brand background color**: Themed background matching the signer's brand colors
- **Branded text**: Context-aware text like "log in with Phantom" or "sign up with Google"

### Single Signer Configuration

```typescript
// Single signer configuration enables branded buttons
const controller = new Controller({
  signupOptions: ["phantom-evm"], // Only Phantom EVM authentication
});

// Users will see "sign up with Phantom" button with Phantom icon and branding
```

### Dynamic Single Signer Configuration

```typescript
// Dynamic override also enables branded buttons
const controller = new Controller({
  signupOptions: ["webauthn", "google", "metamask"], // Multiple default options
});

// This connection will show branded Phantom button
await controller.connect({
  signupOptions: ["phantom-evm"] // Single option override
});
```

### Multiple Signer Configuration

```typescript
// Multiple signers show generic buttons
const controller = new Controller({
  signupOptions: ["webauthn", "google", "metamask"], // Multiple options
});

// Users will see generic "log in" or "sign up" buttons
```

### Supported Branded Signers

The following authentication methods support branded styling:

- **webauthn**: Passkey icon with default styling
- **google**: Google icon with white background
- **discord**: Discord icon with Discord purple background
- **twitter**: Twitter/X icon with themed background
- **metamask**: MetaMask icon with orange background
- **phantom**: Phantom icon with purple background
- **phantom-evm**: Phantom icon with purple background
- **password**: Lock icon with gray background
- **walletconnect**: WalletConnect icon with blue background
- **rabby**: Rabby icon with themed background

### Button Behavior

The branded submit button adapts its text based on the user's state:

- **New users**: Displays "sign up with [Signer]" when entering a new username
- **Existing users**: Displays "log in with [Signer]" when entering an existing username  
- **Generic state**: Shows "log in" or "sign up" when username field is empty

### Extension Validation

For extension-based signers (MetaMask, Phantom, Rabby), the branded button automatically:

- Detects if the required browser extension is installed
- Disables the button if the extension is missing
- Shows appropriate error messaging to guide users to install the extension

## Purchase Methods

Cartridge Controller includes built-in methods for opening purchase interfaces:

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

## Standalone Authentication

Cartridge Controller supports **standalone authentication flows** that establish first-party storage access for seamless cross-domain gameplay.
This is particularly useful for games that redirect users between different domains (e.g., from game launcher to game client).

### controller.open()

The `open()` method redirects users to the keychain in standalone mode, establishing first-party storage access that enables seamless iframe authentication across all game domains.

```typescript
type OpenOptions = {
  redirectUrl?: string; // URL to redirect to after authentication (defaults to current page)
};

controller.open(options?: OpenOptions);
```

**Example Usage:**

```typescript
// Redirect to keychain for authentication, then return to current page
controller.open();

// Redirect to keychain, then redirect to a specific game URL
controller.open({ 
  redirectUrl: "https://my-game.com/play" 
});
```

### How Standalone Authentication Works

The standalone authentication flow follows this pattern:

1. **Application calls `controller.open()`** - User is redirected to the keychain in first-party context
2. **User authenticates** - Keychain establishes first-party storage and session state
3. **Keychain redirects back** - User returns to the application with `controller_standalone=1` parameter
4. **Controller detects return** - Automatically requests Storage Access API permissions for iframe
5. **Seamless iframe access** - All subsequent controller operations work seamlessly across domains

### Storage Access Management

Cartridge Controller automatically manages the Storage Access API to enable cross-domain iframe functionality:

#### Automatic Storage Access Detection

```typescript
// Check if keychain iframe has first-party storage access
const hasAccess = await controller.hasFirstPartyAccess();

if (!hasAccess) {
  // Redirect to standalone auth flow
  controller.open();
}
```

#### Manual Storage Access Control

The keychain iframe also exposes a `requestStorageAccess()` method for manual control:

```typescript
// Request storage access from within the keychain iframe context
await keychain.requestStorageAccess();
```

### URL Parameter Handling

Cartridge Controller automatically handles several URL parameters related to authentication flows:

- **`controller_standalone=1`** - Indicates successful completion of standalone auth flow
- **`controller_redirect`** - Triggers automatic redirect to keychain for authentication
- **`lastUsedConnector=controller`** - Backwards compatibility parameter for framework detection

These parameters are automatically cleaned from the URL after processing to maintain clean application URLs.

### Cross-Domain Game Integration

The standalone authentication pattern is particularly powerful for games that operate across multiple domains:

**Example: Game Launcher → Game Client Flow**

```typescript
// In game launcher (launcher.example.com)
const controller = new Controller();

// Check if user needs authentication
const account = await controller.probe();
if (!account) {
  // Redirect to keychain, then to game client
  controller.open({ 
    redirectUrl: "https://game.example.com/play" 
  });
  return;
}

// User is authenticated, can redirect directly to game
window.location.href = "https://game.example.com/play";
```

```typescript
// In game client (game.example.com)  
const controller = new Controller();

// Controller automatically detects return from standalone auth
// and requests storage access for seamless iframe operations
const account = await controller.probe(); // Works seamlessly
```

### Security Considerations

The standalone authentication flow includes several security measures:

- **URL validation** - Redirect URLs are validated to prevent open redirect attacks
- **Protocol restrictions** - Only `http:` and `https:` protocols are allowed
- **Localhost restrictions** - Localhost redirects are blocked in production environments
- **Domain validation** - Redirect URLs must have valid hostnames

## Browser Compatibility

Storage Access API support varies by browser:

- **Safari** - Full support, required for cross-domain iframe access
- **Chrome/Edge** - Full support when third-party cookies are blocked
- **Firefox** - Full support in private browsing and with strict privacy settings
- **Legacy browsers** - Graceful degradation, assumes storage access is available