---
title: Controller Telegram Integration
description: Learn how to integrate the Cartridge Controller into your Telegram Mini App, including setup, configuration, and usage examples.
---

# Telegram

## Controller Integration Flow

1.  Generate local Stark key pair and store private key in Telegram cloud storage
2.  Open session controller page with user's public key
3.  Controller registers session public key and returns account info
4.  Create controller session account on client
5.  Store account info in Telegram cloud storage

* * *

## Setting up the Session Provider

### 1. Define your configuration:

```typescript
// config.ts
export const RPC_URL = "https://api.cartridge.gg/x/starknet/mainnet";

// Define your session policies
export const SESSION_POLICIES = {
  contracts: {
    "0x70fc96f845e393c732a468b6b6b54d876bd1a29e41a026e8b13579bf98eec8f": {
      methods: [
        {
          name: "attack",
          entrypoint: "attack",
          description: "Attack the beast",
        },
        {
          name: "claim",
          entrypoint: "claim",
          description: "Claim your tokens",
        },
      ],
    },
  },
};

export const REDIRECT_URI = "https://t.me/hitthingbot/hitthing";
```

### 2. Create the SessionProvider:

```typescript
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { constants } from "starknet";
import SessionConnector from "@cartridge/connector/session";
import { StarknetConfig, jsonRpcProvider } from "@starknet-react/core";
import { useLaunchParams, cloudStorage } from "@telegram-apps/sdk-react";
import { RPC_URL, SESSION_POLICIES, REDIRECT_URI } from "./config";

const connector = new SessionConnector({
  policies: SESSION_POLICIES,
  rpc: RPC_URL,
  chainId: constants.StarknetChainId.SN_MAINNET,
  redirectUrl: REDIRECT_URI,
});

const provider = jsonRpcProvider({
  rpc: () => ({ nodeUrl: RPC_URL }),
});

export function SessionProvider({ children }: PropsWithChildren) {
  return (
    <StarknetConfig
      autoConnect
      connectors={[connector]}
      provider={provider}
    >
      {children}
    </StarknetConfig>
  );
}
```

### 3. Use the SessionProvider in your app:

```typescript
// App.tsx
import { SessionProvider } from "./SessionProvider";

function App() {
  return (
    <SessionProvider>
      <YourApp />
    </SessionProvider>
  );
}
```

### 4. Use the session in your components:

```typescript
function GameComponent() {
  const { isConnected, connect, disconnect } = useSession();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  };

  return (
    <div>
      {!isConnected ? (
        <button onClick={handleConnect}>Connect Wallet</button>
      ) : (
        <button onClick={disconnect}>Disconnect</button>
      )}
      
      {isConnected && (
        <div>
          {/* Your game content */}
        </div>
      )}
    </div>
  );
}
```

### 5. Error Handling

```typescript
function GameComponent() {
  const { connect } = useSession();
  const [error, setError] = useState<string>();

  const handleConnect = async () => {
    try {
      await connect();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to connect");
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button onClick={handleConnect}>Connect</button>
    </div>
  );
}
```

See the full example [here](https://github.com/cartridge-gg/beast-slayers).

## Next.js Configuration for WebAssembly

If you're using Next.js, you'll need to configure it to properly handle WebAssembly modules used by the SessionController and SessionConnector. Create or update your `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer, dev }) => {
    // Enable WebAssembly
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      topLevelAwait: true,
    };

    // Fix for WebAssembly in production builds
    if (!dev && isServer) {
      config.output.webassemblyModuleFilename = "chunks/[id].wasm";
      config.plugins.push(new WasmChunksFixPlugin());
    }

    return config;
  },
};

// Plugin to fix WASM chunk loading in production
class WasmChunksFixPlugin {
  apply(compiler) {
    compiler.hooks.thisCompilation.tap("WasmChunksFixPlugin", (compilation) => {
      compilation.hooks.processAssets.tap(
        { name: "WasmChunksFixPlugin" },
        (assets) =>
          Object.entries(assets).forEach(([pathname, source]) => {
            if (!pathname.match(/\.wasm$/)) return;
            compilation.deleteAsset(pathname);

            const name = pathname.split("/")[1];
            const info = compilation.assetsInfo.get(pathname);
            compilation.emitAsset(name, source, info);
          }),
      );
    });
  }
}

module.exports = nextConfig;
```

