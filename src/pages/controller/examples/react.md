---
showOutline: 1
title: Controller React Integration
description: Learn how to integrate the Cartridge Controller into your React application, including setup, configuration, and usage examples.
---

# Cartridge Controller React Integration

This guide demonstrates how to integrate the Cartridge Controller with a React application.

## Installation

:::code-group

```bash [npm]
npm install @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet
npm install -D tailwindcss vite-plugin-mkcert
```

```bash [pnpm]
pnpm add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet
pnpm add -D tailwindcss vite-plugin-mkcert
```

```bash [yarn]
yarn add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet
yarn add -D tailwindcss vite-plugin-mkcert
```

```bash [bun]
bun add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet
bun add -D tailwindcss vite-plugin-mkcert
```

:::

## Basic Setup

### 1. Configure the Starknet Provider

First, set up the Starknet provider with the Cartridge Controller connector:

You can customize the `ControllerConnector` by providing configuration options
during instantiation. The `ControllerConnector` accepts an options object that
allows you to configure various settings such as policies, RPC URLs, theme, and
more.

> ⚠️ **Important**: The `ControllerConnector` instance must be created outside of any React components. Creating it inside a component will cause the connector to be recreated on every render, which can lead to connection issues.

```typescript
import { sepolia, mainnet } from "@starknet-react/chains";
import {
  StarknetConfig,
  jsonRpcProvider,
  cartridge,
} from "@starknet-react/core";
import { ControllerConnector } from "@cartridge/connector";
import { SessionPolicies } from "@cartridge/controller";

// Define your contract addresses
const ETH_TOKEN_ADDRESS =
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'

// Define session policies
const policies: SessionPolicies = {
  contracts: {
    [ETH_TOKEN_ADDRESS]: {
      methods: [
        {
          name: "approve",
          entrypoint: "approve",
          spender: "0x1234567890abcdef1234567890abcdef12345678",
          amount: "0xffffffffffffffffffffffffffffffff",
          description: "Approve spending of tokens",
        },
        { name: "transfer", entrypoint: "transfer" },
      ],
    },
  },
}

// Initialize the connector
const connector = new ControllerConnector({
  policies,
  // With the defaults, you can omit chains if you want to use:
  // - chains: [
  //     { rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia" },
  //     { rpcUrl: "https://api.cartridge.gg/x/starknet/mainnet" },
  //   ]
})

// Configure RPC provider
const provider = jsonRpcProvider({
  rpc: (chain: Chain) => {
    switch (chain) {
      case mainnet:
      default:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' };
      case sepolia:
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia' }
    }
  },
})

export function StarknetProvider({ children }: { children: React.ReactNode }) {
  return (
    <StarknetConfig
      autoConnect
      defaultChainId={mainnet.id}
      chains={[mainnet, sepolia]}
      provider={provider}
      connectors={[connector]}
      explorer={cartridge}
    >
      {children}
    </StarknetConfig>
  )
}
```

### 2. Create a Wallet Connection Component

Use the `useConnect`, `useDisconnect`, and `useAccount` hooks to manage wallet
connections:

```typescript
import { useEffect, useState } from 'react'
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { ControllerConnector } from '@cartridge/connector'
import { Button } from '@cartridge/ui'

export function ConnectWallet() {
  const { connect, connectors } = useConnect()
  const { disconnect } = useDisconnect()
  const { address } = useAccount()
  const controller = connectors[0] as ControllerConnector
  const [username, setUsername] = useState<string>()

  useEffect(() => {
    if (!address) return
    controller.username()?.then((n) => setUsername(n))
  }, [address, controller])

  return (
    <div>
      {address && (
        <>
          <p>Account: {address}</p>
          {username && <p>Username: {username}</p>}
        </>
      )}
      {address ? (
        <Button onClick={() => disconnect()}>Disconnect</Button>
      ) : (
        <div className="space-y-2">
          {/* Standard connection using default signupOptions */}
          <Button onClick={() => connect({ connector: controller })}>
            Connect
          </Button>
          
          {/* Dynamic authentication options for branded flows */}
          <Button onClick={() => controller.connect({ signupOptions: ["phantom-evm"] })}>
            Connect with Phantom
          </Button>
          
          <Button onClick={() => controller.connect({ signupOptions: ["google"] })}>
            Connect with Google
          </Button>
          
          <Button onClick={() => controller.connect({ signupOptions: ["discord"] })}>
            Connect with Discord
          </Button>
        </div>
      )}
    </div>
  )
}
```

### 3. Dynamic Authentication Options

The ControllerConnector now supports dynamic authentication configuration per connection call. This allows you to create multiple branded authentication flows while using a single Controller instance:

```typescript
// Direct connector method - bypasses starknet-react state management
controller.connect({ signupOptions: ["phantom-evm"] })

// For starknet-react integration, use the standard connect method
connect({ connector: controller })
```

#### Key Points:

- **Per-call Override**: `signupOptions` passed to `connect()` override the constructor defaults
- **Branded Flows**: Create specific authentication buttons like "Login with Phantom", "Login with Google"
- **Single Instance**: Use one Controller instance for multiple authentication methods
- **React Integration**: Note that direct `controller.connect()` calls bypass starknet-react's state management

#### Complete Example with Multiple Auth Options:

```tsx
import { useConnect, useAccount } from '@starknet-react/core'
import { ControllerConnector } from '@cartridge/connector'

export function MultiAuthConnectWallet() {
  const { connect, connectors } = useConnect()
  const { address } = useAccount()
  const controller = connectors[0] as ControllerConnector

  const handleSpecificAuth = async (signupOptions: string[]) => {
    try {
      // Direct controller connection for specific auth options
      await controller.connect({ signupOptions })
      
      // Manually trigger starknet-react state update
      connect({ connector: controller })
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }

  if (address) {
    return <div>Connected: {address}</div>
  }

  return (
    <div className="grid gap-2">
      <h3>Choose your authentication method:</h3>
      
      {/* Standard multi-option flow */}
      <button onClick={() => connect({ connector: controller })}>
        Connect Wallet
      </button>
      
      {/* Branded single-option flows */}
      <button 
        onClick={() => handleSpecificAuth(["phantom-evm"])}
        className="phantom-branded-button"
      >
        Continue with Phantom
      </button>
      
      <button 
        onClick={() => handleSpecificAuth(["google"])}
        className="google-branded-button"
      >
        Continue with Google
      </button>
      
      <button 
        onClick={() => handleSpecificAuth(["discord"])}
        className="discord-branded-button"
      >
        Continue with Discord
      </button>
    </div>
  )
}
```

### 4. Performing Transactions

Execute transactions using the `account` object from `useAccount` hook:

```typescript
import { useAccount, useExplorer } from '@starknet-react/core'
import { useCallback, useState } from 'react'

const ETH_CONTRACT =
  '0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7'

export const TransferEth = () => {
  const [submitted, setSubmitted] = useState<boolean>(false)
  const { account } = useAccount()
  const explorer = useExplorer()
  const [txnHash, setTxnHash] = useState<string>()

  const execute = useCallback(
    async (amount: string) => {
      if (!account) return
      setSubmitted(true)
      setTxnHash(undefined)
      try {
        const result = await account.execute([
          {
            contractAddress: ETH_CONTRACT,
            entrypoint: 'approve',
            calldata: [account?.address, amount, '0x0'],
          },
          {
            contractAddress: ETH_CONTRACT,
            entrypoint: 'transfer',
            calldata: [account?.address, amount, '0x0'],
          },
        ])
        setTxnHash(result.transaction_hash)
      } catch (e) {
        console.error(e)
      } finally {
        setSubmitted(false)
      }
    },
    [account],
  )

  if (!account) return null

  return (
    <div>
      <h2>Transfer ETH</h2>
      <button onClick={() => execute('0x1C6BF52634000')} disabled={submitted}>
        Transfer 0.005 ETH
      </button>
      {txnHash && (
        <p>
          Transaction hash:{' '}
          <a
            href={explorer.transaction(txnHash)}
            target="blank"
            rel="noreferrer"
          >
            {txnHash}
          </a>
        </p>
      )}
    </div>
  )
}
```

### 4. Username Lookup

The Controller provides a `lookupUsername` method that allows you to check if a username exists and see what authentication options are available for existing accounts. This is particularly useful for headless flows where you want to determine login vs signup flows:

```typescript
import { useState, useCallback } from 'react'
import { useConnect } from '@starknet-react/core'
import { ControllerConnector } from '@cartridge/connector'

export function UsernameLookup() {
  const { connectors } = useConnect()
  const controller = connectors[0] as ControllerConnector
  const [username, setUsername] = useState<string>('')
  const [lookupResult, setLookupResult] = useState<any>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLookup = useCallback(async () => {
    if (!username.trim()) return
    
    setIsLoading(true)
    try {
      const result = await controller.lookupUsername(username.trim())
      setLookupResult(result)
    } catch (error) {
      console.error('Lookup failed:', error)
      setLookupResult(null)
    } finally {
      setIsLoading(false)
    }
  }, [controller, username])

  const handleHeadlessConnect = useCallback(async (signer: string) => {
    try {
      await controller.connect({
        username: username.trim(),
        signer: signer as any,
      })
    } catch (error) {
      console.error('Connection failed:', error)
    }
  }, [controller, username])

  return (
    <div className="space-y-4">
      <div>
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="border p-2 rounded"
        />
        <button 
          onClick={handleLookup}
          disabled={isLoading || !username.trim()}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {isLoading ? 'Looking up...' : 'Lookup Username'}
        </button>
      </div>

      {lookupResult && (
        <div className="border p-4 rounded">
          <h3 className="font-semibold">Username: {lookupResult.username}</h3>
          <p>Exists: {lookupResult.exists ? 'Yes' : 'No'}</p>
          
          {lookupResult.exists && lookupResult.signers.length > 0 && (
            <div className="mt-2">
              <p>Available authentication methods:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {lookupResult.signers.map((signer: string) => (
                  <button
                    key={signer}
                    onClick={() => handleHeadlessConnect(signer)}
                    className="px-3 py-1 bg-green-500 text-white rounded text-sm"
                  >
                    Login with {signer}
                  </button>
                ))}
              </div>
            </div>
          )}
          
          {!lookupResult.exists && (
            <div className="mt-2">
              <p className="text-gray-600">Username is available for signup</p>
              <button
                onClick={() => handleHeadlessConnect('webauthn')}
                className="mt-2 px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Sign up with WebAuthn
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
```

#### Lookup Response Format

The `lookupUsername` method returns an object with the following structure:

```typescript
interface HeadlessUsernameLookupResult {
  username: string;        // The username that was looked up
  exists: boolean;         // Whether the username exists
  signers: AuthOption[];   // Available authentication methods, e.g. ["webauthn", "google", "password"]
}
```

Available `AuthOption` values include:
- `"webauthn"` - Passkey/WebAuthn authentication
- `"password"` - Password-based authentication  
- `"google"` - Google OAuth
- `"discord"` - Discord OAuth
- `"walletconnect"` - WalletConnect
- `"metamask"` - MetaMask wallet
- `"rabby"` - Rabby wallet
- `"phantom-evm"` - Phantom wallet (EVM)

### 5. Add Components to Your App

```typescript
import { StarknetProvider } from './context/StarknetProvider'
import { ConnectWallet } from './components/ConnectWallet'
import { TransferEth } from './components/TransferEth'
import { UsernameLookup } from './components/UsernameLookup'

function App() {
  return (
    <StarknetProvider>
      <ConnectWallet />
      <UsernameLookup />
      <TransferEth />
    </StarknetProvider>
  )
}
export default App
```

## Development and Testing

If you're working with the Cartridge Controller repository examples, you can use two development modes:

```bash
# Local development with local APIs
pnpm dev

# Testing with production APIs (hybrid mode)
pnpm dev:live
```

The `dev:live` mode is useful when you need to test your React application against production data while keeping your local development environment.

## Important Notes

Make sure to use HTTPS in development by configuring Vite:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

export default defineConfig({
  plugins: [react(), mkcert()],
})
```

## External Wallet Integration

If you're using external wallets (MetaMask, Rabby, etc.) with Cartridge Controller, you can wait for transaction confirmations using the `externalWaitForTransaction` method:

```typescript
import { useState, useCallback } from 'react'
import { ControllerConnector } from '@cartridge/connector'
import { useConnect } from '@starknet-react/core'

export const ExternalWalletTransaction = () => {
  const { connectors } = useConnect()
  const controller = connectors[0] as ControllerConnector
  const [txHash, setTxHash] = useState<string>()
  const [isWaiting, setIsWaiting] = useState<boolean>(false)
  const [receipt, setReceipt] = useState<any>()

  const waitForTransaction = useCallback(async () => {
    if (!txHash || !controller) return

    setIsWaiting(true)
    try {
      // Wait for transaction confirmation with 30-second timeout
      const response = await controller.externalWaitForTransaction(
        'metamask', // or 'rabby', 'phantom', etc.
        txHash,
        30000 // 30 seconds
      )

      if (response.success) {
        setReceipt(response.result)
        console.log('Transaction confirmed:', response.result)
      } else {
        console.error('Transaction failed:', response.error)
      }
    } catch (error) {
      console.error('Error waiting for transaction:', error)
    } finally {
      setIsWaiting(false)
    }
  }, [txHash, controller])

  return (
    <div>
      <h2>External Wallet Transaction Monitor</h2>

      <input
        type="text"
        placeholder="Enter transaction hash"
        value={txHash || ''}
        onChange={(e) => setTxHash(e.target.value)}
      />

      <button
        onClick={waitForTransaction}
        disabled={!txHash || isWaiting}
      >
        {isWaiting ? 'Waiting for confirmation...' : 'Wait for Transaction'}
      </button>

      {receipt && (
        <div>
          <h3>Transaction Receipt:</h3>
          <pre>{JSON.stringify(receipt, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
```

### External Wallet Methods

The Controller provides several methods for interacting with external wallets:

- `externalSwitchChain(walletType, chainId)` - Switch the connected wallet to a different chain
- `externalWaitForTransaction(walletType, txHash, timeoutMs?)` - Wait for transaction confirmation
- `externalSendTransaction(walletType, transaction)` - Send a transaction through the external wallet

These methods work with all supported external wallet types: `metamask`, `rabby`, `phantom`, `argent`, and `walletconnect`.
