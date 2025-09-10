---
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
  starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
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
        return { nodeUrl: 'https://api.cartridge.gg/x/starknet/mainnet' }
      case sepolia:
      default:
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
      explorer={starkscan}
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
import { useAccount, useConnect, useDisconnect } from '@starknet-react/core'
import { useEffect, useState } from 'react'
import ControllerConnector from '@cartridge/connector/controller'
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
        <Button onClick={() => connect({ connector: controller })}>
          Connect
        </Button>
      )}
    </div>
  )
}
```

### 3. Performing Transactions

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

### 4. Add Components to Your App

```typescript
import { StarknetProvider } from './context/StarknetProvider'
import { ConnectWallet } from './components/ConnectWallet'
import { TransferEth } from './components/TransferEth'

function App() {
  return (
    <StarknetProvider>
      <ConnectWallet />
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
import ControllerConnector from '@cartridge/connector/controller'
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
