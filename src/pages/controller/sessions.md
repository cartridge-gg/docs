# Sessions and Policies

Cartridge Controller supports session-based authentication and policy-based transaction approvals. When a policy is preapproved, games can perform interactions seamlessly without requesting approval from the player each time.

## Session Options

```typescript
export type SessionOptions = {
  rpc: string;  // RPC endpoint URL
  chainId: string;  // Chain ID for the session
  policies: Policy[];  // Approved transaction policies
  redirectUrl: string;  // URL to redirect after registration
};
```

## Defining Policies

Policies allow your application to define permissions that can be pre-approved by the user:

```typescript
type Policy = CallPolicy | TypedDataPolicy;

type CallPolicy = {
  target: string;  // Contract address
  method: string;  // Contract method
  description?: string;  // Human readable description
};

type TypedDataPolicy = {
  types: Record<string, StarknetType[]>;
  primaryType: string;
  domain: StarknetDomain;
};
```

## Usage Example

```typescript
// Using the controller directly
const controller = new Controller({
  policies: [
    {
      target: "0xContractAddress",
      method: "increment",
      description: "Allows incrementing the counter"
    }
  ]
});

// Using starknet-react connector
const connector = new CartridgeConnector({
  policies: [...] 
})
```
