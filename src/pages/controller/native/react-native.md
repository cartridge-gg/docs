---
showOutline: 1
title: React Native
description: Integrate Cartridge Controller into React Native applications using Controller.c and TurboModules.
---

# React Native

Controller can be integrated into React Native applications using TurboModules and the Controller.c FFI bindings.
This enables session-based authentication and transaction execution in cross-platform mobile apps.

## Prerequisites

- Node.js >= 20
- pnpm
- Xcode (for iOS)
- CocoaPods (for iOS)
- Android Studio with NDK (for Android)
- Rust with Android targets (for building Android native libs)

## Quick Start

### Installation

```bash
pnpm install
```

### Generate Native Projects

```bash
pnpm exec expo prebuild
```

### Run the App

:::code-group

```bash [iOS]
pnpm run ios
```

```bash [Android]
pnpm run android
```

:::

## Module Setup

The Controller native module is available through the generated bindings from `uniffi-bindgen-react-native`.
Import the module to access Controller functionality:

```typescript
import Controller from './modules/controller/src';

// Access controller functions
const publicKey = Controller.controller.getPublicKey(privateKey);
```

## Session Management

The `useSessionManager` hook handles the complete session lifecycle: key generation, browser-based authentication, and transaction execution.

### Key Generation and Storage

The hook generates a random 32-byte private key and stores it in AsyncStorage.
The corresponding public key is derived using the Controller module.

```typescript
import 'react-native-get-random-values';  // Required for crypto.getRandomValues
import AsyncStorage from '@react-native-async-storage/async-storage';
import Controller from './modules/controller/src';

const STORAGE_KEY = 'session_private_key';

const generateRandomKey = (): string => {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return '0x' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
};

// Load existing key or generate new one
const savedKey = await AsyncStorage.getItem(STORAGE_KEY);
if (savedKey) {
  const publicKey = Controller.controller.getPublicKey(savedKey);
} else {
  const newKey = generateRandomKey();
  await AsyncStorage.setItem(STORAGE_KEY, newKey);
  const publicKey = Controller.controller.getPublicKey(newKey);
}
```

### Opening Browser for Session Auth

Sessions are created by opening a browser to the Cartridge keychain with the public key and requested policies.

```typescript
import * as WebBrowser from 'expo-web-browser';

const KEYCHAIN_URL = 'https://x.cartridge.gg';
const RPC_URL = 'https://api.cartridge.gg/x/starknet/sepolia';

const policies = [
  { target: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', method: 'transfer' },
  { target: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7', method: 'approve' },
];

const params = new URLSearchParams({
  public_key: publicKey,
  policies: JSON.stringify(policies),
  rpc_url: RPC_URL,
});

const url = `${KEYCHAIN_URL}/session?${params.toString()}`;
await WebBrowser.openBrowserAsync(url);
```

### Creating SessionAccount from Subscription

While the browser is open, the app subscribes for session authorization.
Once the user authorizes, a `SessionAccount` is created.

```typescript
import { SessionAccount, type SessionPolicy, type Call } from './modules/controller/src';

const CARTRIDGE_API_URL = 'https://api.cartridge.gg';

const sessionPolicies = {
  policies: [
    { contractAddress: '0x049d...', entrypoint: 'transfer' },
    { 
      contractAddress: '0x049d...', 
      entrypoint: 'approve',
      spender: '0x1234567890abcdef1234567890abcdef12345678',
      amount: '0xffffffffffffffffffffffffffffffff'
    },
  ],
  maxFee: '0x2386f26fc10000', // ~0.01 ETH
};

const session = SessionAccount.createFromSubscribe(
  privateKey,
  sessionPolicies,
  RPC_URL,
  CARTRIDGE_API_URL
);

// Access session metadata
const address = session.address();
const username = session.username();
const expiresAt = session.expiresAt();
```

### Executing Transactions

Once a session is established, transactions can be executed without additional user approval.

```typescript
const calls: Call[] = [{
  contractAddress: '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7',
  entrypoint: 'transfer',
  calldata: [recipientAddress, amount, '0x0'],
}];

try {
  const txHash = sessionAccount.executeFromOutside(calls);
  console.log('Transaction submitted:', txHash);
} catch (error) {
  console.error('Transaction failed:', error);
}
```

## Full Example

```typescript
import { useSessionManager } from '../hooks/useSessionManager';

export default function App() {
  const {
    publicKey,
    sessionAccount,
    sessionMetadata,
    openSessionInWebView,
    executeTransaction,
    isLoading,
    errorMessage,
    reset,
  } = useSessionManager();

  const handleExecuteTransfer = async () => {
    const ethContract = '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7';
    const recipient = '0x1234...';
    const amount = '0x1';

    await executeTransaction(ethContract, 'transfer', [recipient, amount, '0x0']);
  };

  return (
    <View>
      {!sessionAccount ? (
        <Button onPress={openSessionInWebView} disabled={isLoading}>
          Connect Session
        </Button>
      ) : (
        <>
          <Text>Connected: {sessionMetadata.username}</Text>
          <Button onPress={handleExecuteTransfer}>
            Execute Transfer
          </Button>
          <Button onPress={reset}>
            Reset Session
          </Button>
        </>
      )}
    </View>
  );
}
```

## Full Example Repository

For a complete working example including project structure, native module configuration, and build scripts, see the [React Native example on GitHub](https://github.com/cartridge-gg/controller.c/tree/main/examples/react-native).
