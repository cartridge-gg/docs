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
| Setup Complexity | Higher (policy definition) | Lower (basic setup) |
| Best For | Games, frequent transactions | Simple apps, occasional transactions |

## Session Options

```typescript
export type SessionOptions = {
  rpc: string;                      // RPC endpoint URL
  chainId: string;                  // Chain ID for the session
  policies: SessionPolicies;        // Approved transaction policies
  redirectUrl: string;              // URL to redirect after registration
  disconnectRedirectUrl?: string;   // Optional URL to redirect after disconnect/logout
};
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
  spender?: string;                     // For approve methods: address that can spend tokens
  amount?: string | number;             // For approve methods: amount that can be spent
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
});
```

When `disconnect()` is called, users will be redirected to the keychain logout page, and after successful logout, they will be automatically redirected to your specified URL.

**Note**: If no `disconnectRedirectUrl` is provided, users will remain on the keychain logout page after disconnection.

## Verified Sessions

Verified session policies provide a better user experience by attesting to the validity of a game's policy configuration, giving confidence to the players.

![Verified Session](/verified-session.svg)

**Automatic Session Creation**

When using verified session policies, the user experience is significantly improved:

- **No Approval Screen**: Verified sessions automatically bypass the user approval screen
- **Instant Connection**: Sessions are created automatically with a default 7-day duration
- **Seamless UX**: Users can start playing immediately without manual session approval
- **Graceful Fallback**: If automatic session creation fails, the system falls back to showing the standard approval UI

This automatic behavior only applies to **verified policies.**
Unverified policies will continue to show the approval screen as before, maintaining security for untrusted applications.

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

#### Token Approval Policies

For token approval methods, you must specify both `spender` and `amount` fields to create an `ApprovalPolicy`. This provides enhanced security and user experience with spending limits.

```typescript
const policies: SessionPolicies = {
  contracts: {
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": {
      name: "Ethereum",
      description: "ETH token contract",
      methods: [
        {
          name: "Approve Spending",
          description: "Allow contract to spend ETH tokens",
          entrypoint: "approve",
          spender: "0x1234567890abcdef...",     // Contract that can spend tokens
          amount: "0x1774160BC6690000"          // Maximum amount (in wei)
        },
        {
          name: "Transfer",
          description: "Transfer ETH tokens",
          entrypoint: "transfer"
        }
      ]
    }
  }
};
```

**Important**: When using approve methods, always specify both `spender` and `amount` fields. Legacy approve methods without these fields will fall back to `CallPolicy` and show a deprecation warning.

**Migration from Legacy Approve Methods**

If you have existing approve methods without `spender` and `amount` fields, update them to use the new format:

```typescript
// ❌ Legacy format (deprecated)
{
  name: "Approve",
  entrypoint: "approve"
}

// ✅ New format (recommended)
{
  name: "Approve Spending",
  entrypoint: "approve",
  spender: "0x1234567890abcdef...",  // Contract that can spend tokens
  amount: "0x1774160BC6690000"       // Maximum spending amount
}
```

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
