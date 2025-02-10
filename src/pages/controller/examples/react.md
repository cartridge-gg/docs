---
title: Controller React Integration
description: Learn how to integrate the Cartridge Controller into your React application, including setup, configuration, and usage examples.
---

# Cartridge Controller React Integration

This guide demonstrates how to integrate the Cartridge Controller with a React application.

## Creating a New Project

To start, create a new Next.js or Vite application. Choose one of the following commands based on your package manager:

### Next.js
:::code-group

```bash [pnpm]
pnpm create next-app@latest my-project
```

```bash [npm]
npx create-next-app@latest my-project
```

```bash [yarn]
yarn create next-app my-project
```

```bash [bun]
bun create next my-project
```

:::

### Vite

:::code-group

```bash [pnpm]
pnpm create vite
```

```bash [npm]
npm create vite@latest
```

```bash [yarn]
yarn create vite
```

```bash [bun]
bun create vite
```

:::

When prompted, select the following options:

-   **TypeScript**: Yes (recommended)
-   **ESLint**: No
-   **Tailwind CSS**: Yes
-   **src/ Directory**: Yes
-   **Import Alias**: Yes

After the project is created, navigate to your project directory:

```bash
cd my-project
```

## Installation

Next, install the necessary dependencies:

:::code-group

```bash [npm]
npm install @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet @chakra-ui/react
```

```bash [pnpm]
pnpm add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet @chakra-ui/react
```

```bash [yarn]
yarn add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet @chakra-ui/react
```

```bash [bun]
bun add @cartridge/connector @cartridge/controller @starknet-react/core @starknet-react/chains starknet @chakra-ui/react
```

:::

## Basic Setup

### 1. Configure the Starknet Provider

Begin by setting up the Starknet provider with the Cartridge Controller connector. This allows your React app to interact with the Starknet blockchain via the Cartridge Controller.

Make sure that the `ControllerConnector` is instantiated outside of any React components. Instantiating it inside a component can lead to issues because it will be recreated on every render.

```typescript
import { sepolia, mainnet, Chain } from "@starknet-react/chains";
import {
    StarknetConfig,
    jsonRpcProvider,
    starkscan,
} from "@starknet-react/core";
import ControllerConnector from "@cartridge/connector/controller";
import { SessionPolicies } from "@cartridge/controller";

// Define your contract addresses
const ETH_TOKEN_ADDRESS =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

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
};

// Initialize the connector
const connector = new ControllerConnector({
    policies,
    rpc: "https://api.cartridge.gg/x/starknet/sepolia",
});

// Configure RPC provider
const provider = jsonRpcProvider({
    rpc: (chain: Chain) => {
        switch (chain) {
            case mainnet:
                return {
                    nodeUrl: "https://api.cartridge.gg/x/starknet/mainnet",
                };
            case sepolia:
            default:
                return {
                    nodeUrl: "https://api.cartridge.gg/x/starknet/sepolia",
                };
        }
    },
});

export function StarknetProvider({ children }: { children: React.ReactNode }) {
    return (
        <StarknetConfig
            autoConnect
            chains={[mainnet, sepolia]}
            provider={provider}
            connectors={[connector]}
            explorer={starkscan}
        >
            {children}
        </StarknetConfig>
    );
}
```

### 2. Create a Wallet Connection Component

Use the `useConnect`, `useDisconnect`, and `useAccount` hooks from `@starknet-react/core` to manage wallet connections. The following component allows users to connect their wallet and view their username once connected.

```typescript
import { useAccount, useConnect, useDisconnect } from "@starknet-react/core";
import { useEffect, useState } from "react";
import ControllerConnector from "@cartridge/connector/controller";

export function ConnectWallet() {
    const { connect, connectors } = useConnect();
    const { disconnect } = useDisconnect();
    const { address } = useAccount();
    const controller = connectors[0] as ControllerConnector;
    const [username, setUsername] = useState<string>();

    useEffect(() => {
        if (!address) return;
        controller.username()?.then((n) => setUsername(n));
    }, [address, controller]);

    return (
        <div>
            {address && (
                <>
                    <p>Account: {address}</p>
                    {username && <p>Username: {username}</p>}
                </>
            )}
            {address ? (
                <button onClick={() => disconnect()}>Disconnect</button>
            ) : (
                <button onClick={() => connect({ connector: controller })}>
                    Connect
                </button>
            )}
        </div>
    );
}
```

### 3. Performing Transactions

Execute transactions using the `account` object from the `useAccount` hook. Below is an example of transferring ETH through a smart contract:

```typescript
import { useAccount, useExplorer } from "@starknet-react/core";
import { useCallback, useState } from "react";

const ETH_CONTRACT =
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7";

export const TransferEth = () => {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const { account } = useAccount();
    const explorer = useExplorer();
    const [txnHash, setTxnHash] = useState<string>();

    const execute = useCallback(
        async (amount: string) => {
            if (!account) return;
            setSubmitted(true);
            setTxnHash(undefined);
            try {
                const result = await account.execute([
                    {
                        contractAddress: ETH_CONTRACT,
                        entrypoint: "approve",
                        calldata: [account?.address, amount, "0x0"],
                    },
                    {
                        contractAddress: ETH_CONTRACT,
                        entrypoint: "transfer",
                        calldata: [account?.address, amount, "0x0"],
                    },
                ]);
                setTxnHash(result.transaction_hash);
            } catch (e) {
                console.error(e);
            } finally {
                setSubmitted(false);
            }
        },
        [account]
    );

    if (!account) return null;

    return (
        <div>
            <h2>Transfer ETH</h2>
            <button
                onClick={() => execute("0x1C6BF52634000")}
                disabled={submitted}
            >
                Transfer 0.005 ETH
            </button>
            {txnHash && (
                <p>
                    Transaction hash:{" "}
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
    );
};
```

### 4. Add Components to Your App

Finally, integrate the components into your main application:

```typescript
import { StarknetProvider } from "./context/StarknetProvider";
import { ConnectWallet } from "./components/ConnectWallet";
import { TransferEth } from "./components/TransferEth";

function App() {
    return (
        <ChakraProvider>
            <StarknetProvider>
                <ConnectWallet />
                <TransferEth />
            </StarknetProvider>
        </ChakraProvider>
    );
}
export default App;
```

## Important Notes
### Next.js HTTPS Setup
To enable HTTPS in development, you need to modify your `package.json` file and add the following `dev` script:

```json
{
    "scripts": {
        "dev": "next dev --experimental-https"
    }
}
```

Additionally, make sure to configure `next.config.ts` for HTTPS:

```typescript
import type { NextConfig } from "next";

import mkcert from "vite-plugin-mkcert";

const nextConfig: NextConfig = {
    plugins: [mkcert()],
};

export default nextConfig;
```

### Vite HTTPS Setup

To enable HTTPS in development with Vite, modify your `vite.config.ts` file:

```typescript 
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'
 
export default defineConfig({
  plugins: [react(), mkcert()],
})
```
