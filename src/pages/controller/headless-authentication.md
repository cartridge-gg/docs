---
showOutline: 1
title: Headless Authentication
description: Programmatic authentication with the Cartridge Controller SDK without opening any UI, perfect for automation and seamless user experiences.
---

# Headless Authentication

Headless authentication enables programmatic authentication with the Cartridge Controller SDK without displaying any user interface. This is ideal for automated workflows, server-side applications, and creating seamless user experiences where you want to minimize UI interruptions.

## Overview

Headless mode works by:
1. Passing credentials directly to `controller.connect({ username, signer, password? })`
2. Performing authentication in a hidden iframe without opening any modal
3. Only showing UI if session policies require explicit user approval
4. Returning the authenticated account for immediate use

```
Controller SDK → Hidden Keychain iframe → Backend API → Authenticated Account
```

## Basic Usage

### WebAuthn/Passkey Authentication

The most secure option for headless authentication uses WebAuthn (passkeys):

```ts
import Controller from "@cartridge/controller";

const controller = new Controller({});

try {
  const account = await controller.connect({
    username: "alice",
    signer: "webauthn",
  });
  
  console.log("Authenticated successfully:", account.address);
} catch (error) {
  console.error("Authentication failed:", error.message);
}
```

### Password Authentication

For scenarios where WebAuthn isn't available:

```ts
const account = await controller.connect({
  username: "alice",
  signer: "password",
  password: "your-secure-password",
});
```

:::warning
Never hardcode passwords in your source code. Use environment variables, secure configuration files, or prompt users for their passwords at runtime.
:::

### OAuth Providers

Authenticate using social login providers:

```ts
// Google OAuth
await controller.connect({ 
  username: "alice", 
  signer: "google" 
});

// Discord OAuth
await controller.connect({ 
  username: "alice", 
  signer: "discord" 
});
```

### EVM Wallet Authentication

Connect using Ethereum wallets via EIP-191 signing:

```ts
// MetaMask
await controller.connect({ 
  username: "alice", 
  signer: "metamask" 
});

// Phantom EVM
await controller.connect({ 
  username: "alice", 
  signer: "phantom-evm" 
});

// Rabby Wallet
await controller.connect({ 
  username: "alice", 
  signer: "rabby" 
});
```

### WalletConnect

For mobile wallet connections:

```ts
await controller.connect({ 
  username: "alice", 
  signer: "walletconnect" 
});
```

## Supported Signer Options

Headless mode supports all implemented authentication methods:

- `webauthn` - WebAuthn/Passkey (most secure)
- `password` - Username/password authentication
- `google` - Google OAuth
- `discord` - Discord OAuth
- `metamask` - MetaMask wallet
- `rabby` - Rabby wallet
- `phantom-evm` - Phantom EVM wallet
- `walletconnect` - WalletConnect protocol

## Session Approval Flow

If your application uses [session policies](/controller/sessions) that haven't been verified or include spending limits that require approval, the keychain will automatically open the approval UI after successful authentication:

```ts
const controller = new Controller({
  policies: {
    contracts: {
      "0x1234...": {
        name: "My Game Contract",
        methods: [{ name: "play", entrypoint: "play" }],
      },
    },
  },
});

// This may open session approval UI after authentication
const account = await controller.connect({
  username: "alice",
  signer: "webauthn",
});

// Account is ready to use once connect() resolves
await account.execute(/* your transaction */);
```

## Error Handling

Headless authentication provides specific error handling:

```ts
import { HeadlessAuthenticationError } from "@cartridge/controller";

try {
  const account = await controller.connect({
    username: "alice",
    signer: "webauthn",
  });
} catch (error) {
  if (error instanceof HeadlessAuthenticationError) {
    // Handle authentication-specific errors
    console.error("Auth failed:", error.message);
    
    // Common reasons:
    // - Username doesn't exist
    // - Signer not associated with username
    // - Invalid credentials
    // - Network connectivity issues
  } else {
    // Handle other errors
    console.error("Unexpected error:", error);
  }
}
```

## Integration Patterns

### React Hook Pattern

Create a reusable hook for headless authentication:

```tsx
import { useCallback, useState } from 'react';
import { useConnect } from '@starknet-react/core';
import { ControllerConnector } from '@cartridge/connector';

export function useHeadlessAuth() {
  const { connectAsync, connectors } = useConnect();
  const [loading, setLoading] = useState(false);
  const controller = connectors[0] as ControllerConnector;

  const authenticateHeadless = useCallback(async (
    username: string, 
    signer: string
  ) => {
    setLoading(true);
    try {
      // Disconnect if already connected
      if (controller.account) {
        await controller.disconnect();
      }

      // Headless authentication
      const account = await controller.connect({ username, signer });
      
      if (!account) {
        throw new Error('Authentication failed');
      }

      // Sync with starknet-react
      await connectAsync({ connector: controller });
      
      return account;
    } finally {
      setLoading(false);
    }
  }, [controller, connectAsync]);

  return { authenticateHeadless, loading };
}
```

### Server-Side Pattern (Node.js)

For server-side applications, use the SessionProvider:

```ts
import { SessionProvider } from "@cartridge/connector";

const sessionProvider = new SessionProvider({
  rpc: "https://api.cartridge.gg/x/starknet/mainnet",
  chainId: "SN_MAIN",
  // Note: SessionProvider doesn't support headless mode directly
  // Use regular browser-based headless authentication for programmatic flows
});
```

:::note
Server-side headless authentication is currently only available through the browser-based Controller SDK. For true server-side usage, consider the [native headless Controller](/controller/native/headless) using C++ bindings.
:::

## Security Considerations

### Credential Storage

- **Never commit credentials to source code**
- Use environment variables for production credentials
- Consider secure key management systems for sensitive applications
- Rotate credentials regularly

### Authentication Method Selection

- **WebAuthn (recommended)**: Most secure, hardware-backed when available
- **OAuth**: Good for user convenience, relies on third-party security
- **Password**: Least secure, but widely compatible
- **EVM Wallets**: Security depends on wallet implementation and user practices

### Session Management

```ts
// Always handle session lifecycle properly
const account = await controller.connect({ username, signer });

// Use the account for transactions
await account.execute(calls);

// Clean up when done
await controller.disconnect();
```

## Differences from Native Headless Mode

This web-based headless authentication is different from the [native headless Controller](/controller/native/headless):

| Feature | Web Headless Authentication | Native Headless Controller |
|---------|----------------------------|----------------------------|
| **Environment** | Browser applications | Server-side, native apps |
| **Implementation** | Hidden iframe + postMessage | Direct API integration |
| **Key Management** | Managed by Cartridge keychain | Application-managed private keys |
| **UI Fallback** | Can open UI for approvals | No UI available |
| **Use Case** | Seamless web UX | Backend services, automation |

## Troubleshooting

### Common Issues

1. **"User not found"**: Username doesn't exist in the system
2. **"Signer not found"**: The specified signer isn't associated with the username
3. **"Not ready to connect"**: Controller initialization is still in progress
4. **Network timeouts**: Check network connectivity and RPC endpoint availability

### Debug Mode

Enable debug logging to troubleshoot issues:

```ts
// Enable debug mode in development
const controller = new Controller({
  // Add debug configuration if available
});

// Check browser console for detailed error messages
```

### Validation

Validate inputs before attempting authentication:

```ts
function validateHeadlessOptions(username: string, signer: string) {
  if (!username || username.trim().length === 0) {
    throw new Error("Username is required");
  }
  
  const validSigners = [
    "webauthn", "password", "google", "discord",
    "metamask", "rabby", "phantom-evm", "walletconnect"
  ];
  
  if (!validSigners.includes(signer)) {
    throw new Error(`Invalid signer: ${signer}`);
  }
}
```

## Next Steps

- Learn about [Session Policies](/controller/sessions) for fine-grained transaction control
- Explore [React integration patterns](/controller/examples/react) for web applications
- Consider [native headless mode](/controller/native/headless) for backend services
- Set up [error handling and logging](/controller/configuration) for production use