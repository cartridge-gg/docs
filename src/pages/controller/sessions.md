---
title: Sessions and Policies
description: Learn about Cartridge Controller's session-based authentication and policy-based transaction approvals system.
---

# Sessions and Policies

Cartridge Controller supports session-based authorization and policy-based transaction approvals. When policies are pre-approved by the user, games can execute transactions seamlessly without requesting approval for each interaction, creating a smooth gaming experience.

## How Sessions Work

1. **Policy Definition**: Games define which contract methods they need to call
2. **User Approval**: Users approve these policies once during initial connection
3. **Session Creation**: Controller creates a session with approved transaction permissions
4. **Gasless Execution**: Games can execute approved transactions without user prompts
5. **Paymaster Integration**: Transactions can be sponsored through Cartridge Paymaster

## Transactions Without Policies

Cartridge Controller can execute transactions **without** defining policies.
When no policies are provided:

- Each transaction requires manual user approval via the Cartridge interface
- Users will see a confirmation screen for every transaction
- No gasless transactions or paymaster integration
- Suitable for simple applications that don't need session-based authorization

```typescript
// Controller without policies - requires manual approval for each transaction
const controller = new Controller();
const account = await controller.connect();

// This will prompt the user for approval
const tx = await account.execute([
  {
    contractAddress: "0x123...",
    entrypoint: "transfer",
    calldata: ["0x456...", "100"],
  }
]);
```

## Transactions With Policies

```ts
const policies = {
  // Define your polices here
}

// Using the controller directly
const controller = new Controller({
  policies,
  // other options
});

// Using the starknet-react connector
const connector = new CartridgeConnector({
  policies,
  // other options
});

// Future transactions will not require approval
```

:::info
Full integration examples [are available here](https://github.com/cartridge-gg/controller/blob/main/examples/next/src/components/providers/StarknetProvider.tsx).
:::

## Sessions vs. Manual Approval

| Feature | With Policies (Sessions) | Without Policies (Manual) |
|---------|--------------------------|---------------------------|
| Transaction Approval | Pre-approved via policies | Manual approval each time |
| User Experience | Seamless gameplay | Confirmation prompts |
| Gasless Transactions | Yes (via Paymaster) | No |
| Error Handling | Configurable (see [error propagation](/controller/configuration.md#propagate-session-errors)) | Always shows keychain UI |
| Setup Complexity | Higher (policy definition) | Lower (basic setup) |
| Error Handling | Configurable display modes | Standard modal display |
| Best For | Games, frequent transactions | Simple apps, occasional transactions |

## Session Options

```typescript
export type SessionOptions = {
  rpc: string;                      // RPC endpoint URL
  chainId: string;                  // Chain ID for the session
  policies: SessionPolicies;        // Approved transaction policies
  redirectUrl: string;              // URL to redirect after registration
  disconnectRedirectUrl?: string;   // Optional URL to redirect after disconnect/logout
  signupOptions?: AuthOptions;      // Optional authentication methods available during session creation
};
```

### Authentication Options

The `signupOptions` parameter allows you to customize which authentication methods are available during session creation, providing the same flexibility as the ControllerProvider:

```typescript
type AuthOptions = (
  | "google"        // Google OAuth
  | "webauthn"      // WebAuthn/Passkeys
  | "discord"       // Discord OAuth
  | "twitter"       // Twitter/X OAuth
  | "walletconnect" // WalletConnect
  | "metamask"      // MetaMask
  | "password"      // Email/Password
  | "rabby"         // Rabby Wallet
)[];
```

**Benefits of customizing authentication options:**
- **Consistent UX**: Provide the same authentication methods across ControllerProvider and SessionProvider
- **Targeted Experience**: Show only the authentication methods that work best for your application
- **Platform Optimization**: Customize options based on platform (e.g., remove external wallets on mobile)
- **Branding**: Focus on authentication methods that align with your user base

**Example: Shared authentication configuration**
```typescript
const signupOptions: AuthOptions = [
  "google",
  "webauthn", 
  "discord",
  "twitter",
  "walletconnect",
  "metamask",
];

// Use the same options for both connectors
const controller = new ControllerConnector({
  policies,
  signupOptions,
  // other options...
});

const session = new SessionConnector({
  policies,
  rpc: "https://starknet-mainnet.public.blastapi.io/rpc/v0.7",
  chainId: "SN_MAIN", 
  redirectUrl: "https://myapp.com/",
  signupOptions, // Same authentication options including Twitter
});
```

## Defining Policies

Policies allow your application to define permissions that can be pre-approved by the user:

```typescript
type SessionPolicies = {
  contracts: {
    [address: string]: ContractPolicy;  // Contract interaction policies
  };
  messages?: TypedDataMessage[];        // Optional signed message policies
};

type ContractPolicy = {
  name?: string;                        // Human-readable name of the contract
  description?: string;                 // Description of the contract
  methods: Method[];                    // Allowed contract methods
};

type ContractMethod = {
  name: string;                         // Method name
  entrypoint: string;                   // Contract method entrypoint
  description?: string;                 // Optional method description
  amount?: string;                      // Optional spending limit for approve methods (hex format)
};

type SignMessagePolicy = TypedDataPolicy & {
  name?: string;                        // Human-readable name of the policy
  description?: string;                 // Description of the policy
};

type TypedDataPolicy = {
  types: Record<string, StarknetType[]>;
  primaryType: string;
  domain: StarknetDomain;
};
```

## Error Handling in Sessions

When using session policies, Controller provides configurable error handling options through the `errorDisplayMode` setting. This works in conjunction with the existing `propagateSessionErrors` option to give you fine-grained control over how transaction errors are presented to users.

### Error Display Configuration

```typescript
const controller = new Controller({
  policies: sessionPolicies,
  errorDisplayMode: "notification", // "modal" | "notification" | "silent"
  propagateSessionErrors: false, // Optional: control error propagation
});
```

### Error Display Modes

**Modal Mode (Default)**
- Transaction errors open the controller modal interface
- Users see detailed error information and retry options
- Preserves existing session error handling behavior

**Notification Mode**
- Transaction errors display as clickable toast notifications
- Users can continue their session and address errors when convenient
- Clicking the toast opens the modal for manual retry
- Ideal for gaming applications where modal interruptions are disruptive

**Silent Mode**
- No UI is displayed for transaction errors
- Errors are logged to console for programmatic handling
- Applications must implement custom error handling logic

### Special Error Cases

Certain session-related errors always display UI regardless of the `errorDisplayMode` setting:

- **SessionRefreshRequired**: Always opens modal to refresh expired sessions
- **ManualExecutionRequired**: Always opens modal when manual approval is needed

These exceptions ensure users can complete required authentication flows even in silent mode.

### Error Handling Examples

**Gaming Application with Minimal Interruptions**
```typescript
const gameController = new Controller({
  policies: gameSessionPolicies,
  errorDisplayMode: "notification", // Show clickable toast notifications
});

// Transaction errors show as toast notifications
// Players can continue gameplay and retry when convenient
const account = gameController.account;
await account.execute(gameMoves); // Failed moves show toast notifications
```

**DeFi Application with Detailed Error Handling**
```typescript
const defiController = new Controller({
  policies: tradingPolicies,
  errorDisplayMode: "modal", // Show detailed error modals
  propagateSessionErrors: false,
});

// Transaction errors open detailed modal interface
// Users get comprehensive error information for financial operations
```

**Custom Error Management**
```typescript
const customController = new Controller({
  policies: sessionPolicies,
  errorDisplayMode: "silent",
  propagateSessionErrors: true, // Errors are thrown for custom handling
});

try {
  await account.execute(calls);
} catch (error) {
  // Implement custom error UI and retry logic
  handleCustomErrorFlow(error);
}
```

## Disconnect Redirect

The `disconnectRedirectUrl` option allows you to redirect users to a specific URL after they disconnect or logout from their session. This is particularly useful for:

- **Mobile Apps**: Redirect users back to your mobile app using deep links (e.g., `"myapp://logout-complete"`)
- **Web Apps**: Send users to a logout confirmation page or back to your landing page
- **Cross-Platform**: Handle logout flows consistently across different platforms

```typescript
const session = new SessionConnector({
  policies,
  rpc: "https://starknet-mainnet.public.blastapi.io/rpc/v0.7",
  chainId: "SN_MAIN",
  redirectUrl: "https://myapp.com/",
  disconnectRedirectUrl: "whatsapp://", // Deep link example
  signupOptions: ["google", "webauthn", "discord"], // Optional: customize auth methods
});
```

When `disconnect()` is called, users will be redirected to the keychain logout page, and after successful logout, they will be automatically redirected to your specified URL.

**Note**: If no `disconnectRedirectUrl` is provided, users will remain on the keychain logout page after disconnection.

## Verified Sessions

Verified session policies provide a better user experience by attesting to the validity of a game's policy configuration, giving confidence to the players.

![Verified Session](/verified-session.svg)

**Enhanced Session Creation**

When using verified session policies, the user experience is improved with enhanced trust indicators:

- **Trust Indicators**: Verified sessions display clear verification badges and streamlined approval flows
- **Enhanced Security**: Verified policies provide additional context and confidence to users during approval
- **Consistent Experience**: All session creation flows require user approval to maintain security standards

Both verified and unverified policies follow the same approval flow, with verified policies providing enhanced trust indicators and streamlined user interfaces.

**Getting Verified**

Verified configs can be committed to the `configs` folder in [`@cartridge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs).

Before they are merged, the team will need to collaborate with Cartridge to verify the policies.

## Usage Examples

#### Contract Interaction Policies

Contract interaction policies allow the application to send contract transactions without manual approval from the user.

```typescript
const policies: SessionPolicies = {
  contracts: {
    "0x4ed3a7...": {
      name: "Pillage",
      description: "Allows you to raid and pillage a structure",
      methods: [
        {
          name: "Pillage Structure",
          description: "Pillage a structure",
          entrypoint: "pillage_structure"
        }
      ]
    },
    "0x2620f6...": {
      name: "Battle",
      description: "Required to engage in battles",
      methods: [
        {
          name: "Battle Start",
          description: "Start a battle",
          entrypoint: "battle_start"
        },
        {
          name: "Battle Join",
          description: "Join a battle",
          entrypoint: "battle_join"
        },
      ]
    },
    // Include other contracts as needed
  }
};
```

#### Token Spending Limits

When defining `approve` methods in your contract policies, you can specify spending limits using the `amount` parameter. This creates a spending limit that users can see and approve during session creation.

```typescript
const policies: SessionPolicies = {
  contracts: {
    // ETH contract with spending limit
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": {
      name: "Ethereum",
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          amount: "0x3", // Limit to 3 ETH (in wei, hex format)
          description: "Approve spending up to 3 ETH"
        },
        {
          name: "transfer",
          entrypoint: "transfer"
        }
      ]
    },
    // STRK contract with unlimited spending
    "0x04718f5a0Fc34cC1AF16A1cdee98fFB20C31f5cD61D6Ab07201858f4287c938D": {
      name: "Starknet Token",
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          amount: "0xffffffffffffffffffffffffffffffff", // Unlimited (max uint128)
          description: "Approve unlimited STRK spending"
        }
      ]
    }
  }
};
```

**Spending Limit Display**

When users connect with spending limits configured:
- They'll see a **Spending Limit Card** showing each token and its approved amount
- USD values are displayed alongside token amounts when price data is available
- Users see a consent notice explaining the spending permissions
- Unlimited spending limits are clearly labeled as "Unlimited"

**Amount Format**
- Use hexadecimal format (e.g., `"0x3"` for 3, `"0xffffffffffffffffffffffffffffffff"` for unlimited)
- For ERC20 tokens, amounts should account for token decimals
- Maximum value for unlimited spending is `2^128 - 1` (`0xffffffffffffffffffffffffffffffff`)

#### Signed Message Policies

Signed Message policies allow the application to sign a typed message without manual approval from the user.

```typescript
const policies: SessionPolicies = {
  messages: [
    {
      name: "Eternum Message Signing",
      description: "Allows signing messages for Eternum",
      types: {
        StarknetDomain: [
          { name: "name", type: "shortstring" },
          { name: "version", type: "shortstring" },
          { name: "chainId", type: "shortstring" },
          { name: "revision", type: "shortstring" }
        ],
        "s0_eternum-Message": [
          { name: "identity", type: "ContractAddress" },
          { name: "channel", type: "shortstring" },
          { name: "content", type: "string" },
          { name: "timestamp", type: "felt" },
          { name: "salt", type: "felt" }
        ]
      },
      primaryType: "s0_eternum-Message",
      domain: {
        name: "Eternum",
        version: "1",
        chainId: "SN_MAIN",
        revision: "1"
      }
    }
  ]
};
```
