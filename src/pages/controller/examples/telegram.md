---
title: Controller Telegram Integration
description: Learn how to integrate the Cartridge Controller into your Telegram Mini App, including setup, configuration, and usage examples.
---

# Telegram

## Controller Integration Flow

1. Generate local Stark key pair and store private key in Telegram cloud storage
2. Open session controller page with user's public key
3. Controller registers session public key and returns account info
4. Create controller session account on client
5. Store account info in Telegram cloud storage

---

## Define the useAccount Hook

The `useAccount` hook provides an easy way to integrate the controller into your Telegram Mini App.

### 1. Define the `useAccount` hook:

```typescript
export const RPC_URL = "https://api.cartridge.gg/x/starknet/mainnet";
export const KEYCHAIN_URL = "https://x.cartridge.gg";
export const POLICIES = [
  {
    target: "0x70fc96f845e393c732a468b6b6b54d876bd1a29e41a026e8b13579bf98eec8f",
    method: "attack",
    description: "Attack the beast",
  },
  {
    target: "0x70fc96f845e393c732a468b6b6b54d876bd1a29e41a026e8b13579bf98eec8f",
    method: "claim",
    description: "Claim your tokens",
  },
];
export const REDIRECT_URI = "https://t.me/hitthingbot/hitthing";
```

### 2. Use the hook in your component:

```typescript
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} from "react";
import {
  useLaunchParams,
  cloudStorage,
  miniApp,
  openLink,
} from "@telegram-apps/sdk-react";
import * as Dojo from "@dojoengine/torii-client";
import encodeUrl from "encodeurl";
import { CartridgeSessionAccount } from "@cartridge/account-wasm/session";

interface AccountStorage {
  username: string;
  address: string;
  ownerGuid: string;
  transactionHash?: string;
  expiresAt: string;
}

interface SessionSigner {
  privateKey: string;
  publicKey: string;
}

interface AccountContextType {
  accountStorage?: AccountStorage;
  sessionSigner?: SessionSigner;
  account?: CartridgeSessionAccount;
  openConnectionPage: () => void;
  clearSession: () => void;
  address?: string;
  username?: string;
  keychainUrl?: string;
  redirectUri?: string;
  policies?: { target: string; method: string; description: string }[];
  rpcUrl?: string;
  network?: string;
}

interface AccountProviderProps {
  children: React.ReactNode;
  keychainUrl: string;
  policies: { target: string; method: string; description: string }[];
  redirectUri: string;
  rpcUrl: string;
  network?: string;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export const AccountProvider: React.FC<AccountProviderProps> = ({
  children,
  keychainUrl,
  policies,
  redirectUri,
  rpcUrl,
  network,
}) => {
  const { initData } = useLaunchParams();
  const [accountStorage, setAccountStorage] = useState<AccountStorage>();
  const [sessionSigner, setSessionSigner] = useState<SessionSigner>();

  useEffect(() => {
    const initializeSession = async () => {
      const keys = await cloudStorage.getKeys();

      if (keys.includes("sessionSigner")) {
        const signer = await cloudStorage.getItem("sessionSigner");
        setSessionSigner(JSON.parse(signer) as SessionSigner);
        return;
      }

      const privateKey = Dojo.signingKeyNew();
      const publicKey = Dojo.verifyingKeyNew(privateKey);
      const newSigner = { privateKey, publicKey };

      await cloudStorage.setItem("sessionSigner", JSON.stringify(newSigner));
      setSessionSigner(newSigner);
    };

    const loadStoredAccount = async () => {
      const account = await cloudStorage.getItem("account");
      if (!account) return;

      const parsedAccount = JSON.parse(account) as AccountStorage;
      if (
        !parsedAccount.address ||
        !parsedAccount.ownerGuid ||
        !parsedAccount.expiresAt
      ) {
        await cloudStorage.deleteItem("account");
        return;
      }

      setAccountStorage(parsedAccount);
    };

    initializeSession();
    loadStoredAccount();
  }, []);

  useEffect(() => {
    if (!initData?.startParam) return;

    const cartridgeAccount = JSON.parse(
      atob(initData.startParam)
    ) as AccountStorage;
    cloudStorage.setItem("account", JSON.stringify(cartridgeAccount));
    setAccountStorage(cartridgeAccount);
  }, [initData]);

  const account = useMemo(() => {
    if (!accountStorage || !sessionSigner) return;

    return CartridgeSessionAccount.new_as_registered(
      rpcUrl,
      sessionSigner.privateKey,
      accountStorage.address,
      accountStorage.ownerGuid,
      network
        ? Dojo.cairoShortStringToFelt(network)
        : Dojo.cairoShortStringToFelt("SN_MAINNET"),
      {
        expiresAt: Number(accountStorage.expiresAt),
        policies,
      }
    );
  }, [accountStorage, sessionSigner]);

  const openConnectionPage = async () => {
    if (!sessionSigner) {
      const privateKey = Dojo.signingKeyNew();
      const publicKey = Dojo.verifyingKeyNew(privateKey);
      const newSigner = { privateKey, publicKey };

      await cloudStorage.setItem("sessionSigner", JSON.stringify(newSigner));
      setSessionSigner(newSigner);
      return;
    }

    const url = encodeUrl(
      `${keychainUrl}/session?public_key=${sessionSigner.publicKey}` +
        `&redirect_uri=${redirectUri}&redirect_query_name=startapp` +
        `&policies=${JSON.stringify(policies)}&rpc_url=${rpcUrl}`
    );

    openLink(url, {
      tryInstantView: false,
    });
    miniApp.close();
  };

  const clearSession = async () => {
    await Promise.all([
      cloudStorage.deleteItem("sessionSigner"),
      cloudStorage.deleteItem("account"),
    ]);
    setSessionSigner(undefined);
    setAccountStorage(undefined);
  };

  return (
    <AccountContext.Provider
      value={{
        accountStorage,
        sessionSigner,
        account,
        openConnectionPage,
        clearSession,
        address: accountStorage?.address,
        username: accountStorage?.username,
        keychainUrl,
        redirectUri,
        policies,
        rpcUrl,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
};

export const useAccount = () => {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error("useAccount must be used within an AccountProvider");
  }
  return context;
};
```

### 3. Use the hook in your component:

```javascript
function MyComponent() {
  const {
    accountStorage,
    sessionSigner,
    account,
    openConnectionPage,
    clearSession,
    address,
    username,
  } = useAccount();

  // Use the account information and functions as needed
}
```

### 3. Available properties and functions:

- `accountStorage`: Contains user account information (username, address, ownerGuid)
- `sessionSigner`: Contains the session's private and public keys
- `account`: The CartridgeSessionAccount instance
- `openConnectionPage()`: Function to open the connection page for account setup
- `clearSession()`: Function to clear the current session
- `address`: The user's account address
- `username`: The user's username
- `keychainUrl`: The URL of the keychain
- `redirectUri`: The URI to redirect to after account setup
- `policies`: The policies to use for the session
- `rpcUrl`: The RPC URL to use for the session

### 4. Ensure your app is wrapped with the AccountProvider:

```javascript
import { AccountProvider } from "./path/to/AccountProvider";

function App() {
  return <AccountProvider>{/* Your app components */}</AccountProvider>;
}
```

### 5. Connecting to the controller

```javascript
const { openConnectionPage } = useAccount();
openConnectionPage();
```

See the full example [here](https://github.com/cartridge-gg/beast-slayers).
