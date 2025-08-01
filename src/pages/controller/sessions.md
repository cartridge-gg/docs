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

Cartridge Controller can execute transactions **without** defining policies. When no policies are provided:

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
  rpc: string;                // RPC endpoint URL
  chainId: string;            // Chain ID for the session
  policies: SessionPolicies;  // Approved transaction policies
  redirectUrl: string;        // URL to redirect after registration
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

## Usage Examples

### Contract Interaction Policies Example

```typescript
const policies: SessionPolicies = {
  contracts: {
    "0x4ed3a7c5f53c6e96186eaf1b670bd2e2a3699c08e070aedf4e5fc6ac246ddc1": {
      name: "Pillage",
      description: "Allows you to raid a structure and pillage resources",
      methods: [
        {
          name: "Battle Pillage",
          description: "Pillage a structure",
          entrypoint: "battle_pillage"
        }
      ]
    },
    "0x2620f65aa2fd72d705306ada1ee7410023a3df03da9291f1ccb744fabfebc0": {
      name: "Battle contract",
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
        {
          name: "Battle Leave",
          description: "Leave a battle",
          entrypoint: "battle_leave"
        },
      ]
    },
    // Include other contracts as needed
  }
};

// Using the controller directly
const controller = new Controller({
  policies,
  // other options
});

// Using starknet-react connector
const connector = new CartridgeConnector({
  policies,
  // other options
});
```

### Signed Message Policy Example

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

### Verified Sessions


Verified session policies provide a better user experience by attesting to the validity of a games session policy configuration, providing confidence to it's players.

![Verified Session](/verified-session.svg)

Verified configs can be committed to the `configs` folder in [`@cartridge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs).

Before they are merged, the team will need to collaborate with Cartridge to verify the policies.
