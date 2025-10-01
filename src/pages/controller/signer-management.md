---
description: Learn how to add and manage multiple authentication methods (signers) for your Cartridge Controller account, including Passkeys, social login (Google, Discord), and external wallets.
title: Signer Management
---

# Signer Management

Cartridge Controller supports **multi-signer** functionality, allowing you to add multiple authentication methods to your account for enhanced security and convenience. This feature is now generally available and enables you to sign in using different methods while maintaining access to the same Controller account and assets.

## Overview

Multi-signer support provides several benefits:

- **Flexibility**: Choose the authentication method that works best for each situation
- **Security**: Distribute access across multiple secure authentication methods

## Supported Signer Types

Controller supports four types of signers:

### 1. Passkey (WebAuthn)

- **Biometric authentication** using Face ID, Touch ID, or hardware security keys
- **Platform-native** security with device-based credential storage
- **Cross-platform** compatibility with password managers like Bitwarden, 1Password
- See [Passkey Support](/controller/passkey-support.md) for detailed setup information

### 2. Password Authentication

- **Password-based authentication** with encrypted private key storage
- **Non-recoverable**: Password loss means permanent account loss
- **Minimum requirements**: 8-character minimum password length

> **⚠️ Important**: Password authentication is currently marked as "Testing Only" and should not be used for production applications. Password loss results in permanent account access loss as there are no recovery mechanisms.

### 3. Social Login

Controller offers native social login options through Google and Discord:

- **Streamlined onboarding** for users with existing social accounts  
- **Secure integration** via Turnkey wallet infrastructure with Auth0
- **Native implementation** using OAuth2 flows for improved security and UX

Both Google and Discord login use an intelligent authentication flow that adapts to browser restrictions:

1. **Primary Method**: Attempts to open OAuth in a popup window for seamless experience
2. **Fallback Method**: Automatically redirects to OAuth provider when popups are blocked
3. **Error Handling**: Gracefully handles iframe restrictions and Content Security Policy (CSP) issues
4. **Nonce Security**: Implements proper OIDC token validation with nonce verification

### 4. External Wallets

Controller offers integration with popular external web3 wallets, including Braavos, MetaMask, Rabby, Base, and WalletConnect.

> **Note**: Ethereum-based external wallets (MetaMask, Rabby, Base, WalletConnect) are only available on desktop browsers. These wallets are automatically disabled on mobile devices for optimal user experience. StarkNet wallets (Argent, Braavos) remain fully functional on mobile.

## Adding Signers

### Accessing Signer Management

1. Connect to your Controller account using any existing authentication method
2. Open the **Settings** panel within the Controller interface
3. Navigate to the **Signer(s)** section
4. Click **Add Signer** to begin adding a new authentication method

> **Note**: Signer management is available on **Mainnet only**. The "Add Signer" button will be disabled on testnet environments.

### Adding a Passkey

1. In the Add Signer interface, select **Passkey**
2. Your browser will prompt you to create a new Passkey using:
   - Device biometrics (Face ID, Touch ID, Windows Hello)
   - Hardware security key (USB, NFC, or Bluetooth)
   - Password manager (if configured for Passkey storage)
3. Follow your device's authentication flow
4. Once created, the Passkey will be added to your account

### Adding Password Authentication

> **⚠️ Testing Only**: Password authentication is available but marked for testing purposes only.

1. In the signup or login interface, select **Password** from the authentication options
2. For new accounts:
   - Enter a password (minimum 8 characters)
   - Confirm your password by entering it again
   - Review the security warning about password recovery
3. For existing password accounts:
   - Simply enter your password to login
   - Password must match exactly (case-sensitive)

> **Security Warning**: Password accounts cannot be recovered if you lose your password. This authentication method does not provide any recovery mechanisms, making it unsuitable for production use.

### Adding Social Login

#### Adding Google Login

1. Select **Google** from the signer options
2. The system uses an intelligent OAuth flow:
   - **In iframe environments**: Opens Google OAuth in a popup window for seamless UX
   - **Standard environments**: Uses redirect flow for better compatibility 
   - **Fallback handling**: Automatically switches to redirect if popup is blocked
3. Complete the Google OAuth authorization:
   - Sign in to your Google account if not already logged in
   - Authorize Cartridge Controller to access your Google identity
4. The system creates a secure Turnkey wallet linked to your Google account
5. Your Google login is now available as a Controller authentication method

> **Technical Details**: The implementation uses Auth0 for OAuth management with Turnkey for secure wallet creation. OIDC tokens are validated with proper nonce verification to prevent replay attacks.

#### Adding Discord Login

1. Select **Discord** from the signer options
2. The system uses the same intelligent OAuth flow as Google:
   - **Popup-first approach**: Attempts popup for seamless authentication
   - **Redirect fallback**: Automatically falls back to full redirect when necessary
   - **Browser compatibility**: Handles CSP restrictions and iframe limitations
3. Complete the Discord OAuth authorization:
   - Sign in to your Discord account if not already logged in
   - Authorize Cartridge Controller to access your Discord identity
4. The system creates a secure Turnkey wallet linked to your Discord account
5. Your Discord login is now available as a Controller authentication method

> **Technical Details**: Discord authentication uses the same Auth0 + Turnkey infrastructure as Google login, ensuring consistent security and user experience across both social providers.

### Adding External Wallets

1. Select **Wallet** to see external wallet options
2. Choose from the supported wallet types:
   - **Argent**: StarkNet-native wallet with advanced security features and account management
   - **Braavos**: StarkNet-native wallet with built-in security features
   - **MetaMask**: Popular browser extension wallet (desktop only)
   - **Rabby**: Security-focused multi-chain wallet (desktop only)
   - **Base**: Coinbase's official wallet with multi-chain support (desktop only)
   - **WalletConnect**: Use QR code or deep link to connect mobile/desktop wallets (desktop only)
3. Follow the wallet-specific connection flow
4. Sign the verification message to link the wallet to your account

> **Mobile Limitation**: Ethereum-based wallets (MetaMask, Rabby, Base, WalletConnect) will not appear as options on mobile browsers and are automatically filtered out for better mobile user experience.

## Managing Existing Signers

### Viewing Your Signers

The Signer(s) section displays all authentication methods associated with your account:

- **Signer type** with recognizable icons (fingerprint for Passkey, Discord logo, wallet icons)
- **Current status** indicating which signer you're currently using
- **Identifying information** such as wallet addresses (partially masked for privacy)

### Signer Information Display

Each signer card shows:
- **Type**: Passkey, Password, Google, Discord, Argent, Braavos, MetaMask, Rabby, or WalletConnect
- **Status**: "(current)" label for the active authentication method
- **Identifier**: Shortened wallet address for external wallets, or authentication type for others

### Switching Between Signers

When connecting to your Controller:
- The connection interface will show all available authentication methods
- Select any of your registered signers to authenticate
- Your account and assets remain the same regardless of which signer you use

### Account Synchronization for StarkNet Wallets

Cartridge Controller automatically stays synchronized with account changes in connected StarkNet wallets (Argent and Braavos). This ensures that when users switch accounts within their external wallet, the Controller is immediately updated to reflect the new active account.

**Automatic Synchronization Features:**
- **Real-time Updates**: Controller automatically detects when users switch accounts in Argent or Braavos wallets
- **Seamless Experience**: No manual reconnection required when switching accounts
- **Memory Management**: Proper cleanup of event listeners to prevent memory leaks
- **Connection Reliability**: Automatic listener re-establishment on reconnection

**How It Works:**
1. When connecting an Argent or Braavos wallet, Controller registers an account change listener
2. The listener monitors the wallet's `accountsChanged` events
3. When an account switch is detected, Controller updates its internal state
4. Connected accounts list and active account are automatically synchronized
5. On disconnect, listeners are properly cleaned up to prevent memory issues

> **Note**: Account synchronization is currently available for StarkNet wallets (Argent and Braavos). Other external wallets maintain their existing connection behavior.

### Chain Switching for External Wallets

External wallets (MetaMask, Rabby, Base, WalletConnect) support programmatic chain switching through the Controller interface. This allows applications to request that connected external wallets switch to a specific blockchain network.

**Supported Functionality:**
- **Automatic Chain Switching**: Applications can programmatically request external wallets to switch chains
- **Cross-Chain Compatibility**: Works with Ethereum, Starknet, and other supported networks

**How It Works:**
1. Your application calls the chain switch method through the Controller
2. The request is forwarded to the connected external wallet
3. The wallet handles the chain switching process (may show user confirmation)
4. The application receives confirmation of the successful chain switch

**Example Usage:**
```typescript
// Switch connected external wallet to a different chain
const success = await controller.externalSwitchChain(
  walletType, // e.g., "metamask", "rabby", "base"
  chainId     // Target chain identifier
);
```

**Wallet-Specific Limitations:**
- **Braavos**: Does not support the `wallet_switchStarknetChain` API. Chain switching requests are ignored, and the wallet remains on its current chain.
- **Other Wallets**: Chain switching availability depends on the specific external wallet's capabilities and the target chain support.

### Transaction Confirmation for External Wallets

External wallets (MetaMask, Rabby, Argent, WalletConnect) support waiting for transaction confirmations through the Controller interface.
This allows applications to monitor transaction status and receive confirmation when transactions are mined.

**Supported Functionality:**
- **Transaction Monitoring**: Wait for transaction confirmations with configurable timeouts
- **Receipt Retrieval**: Returns transaction receipt upon successful confirmation

**How It Works:**
1. Your application calls the wait method through the Controller after sending a transaction
2. The request is forwarded to the connected external wallet
3. The wallet polls the blockchain for transaction confirmation
4. The application receives the transaction receipt or timeout error

**Example Usage:**
```typescript
// Wait for transaction confirmation with default timeout (60s)
const response = await controller.externalWaitForTransaction(
  walletType, // e.g., "metamask", "rabby"
  txHash      // Transaction hash from sendTransaction
);
}

// Wait with custom timeout (30 seconds)
const responseWithTimeout = await controller.externalWaitForTransaction(
  walletType,
  txHash,
  30000 // 30 seconds in milliseconds
);
```

**Return Format:**
```typescript
interface ExternalWalletResponse {
  success: boolean;
  wallet: string;
  result?: any;        // Transaction receipt when successful
  error?: string;      // Error message when failed
  account?: string;    // Connected account address
}
```

**Error Handling:**
- **Connection Errors**: Wallet not available or not connected
- **Timeout Errors**: Transaction not confirmed within the specified time
- **Network Errors**: RPC or blockchain connectivity issues
- **Transaction Failures**: Transaction reverted or failed on-chain

**Note:** Transaction confirmation times vary by network conditions and the specific blockchain. Ethereum transactions typically confirm faster than other networks during low congestion periods.

## Security Considerations

### Best Practices

- **Multiple Backups**: Add at least 2-3 different signer types to ensure account recovery
- **Secure Storage**: For Passkeys, ensure your device backup (iCloud, Google) is secure
- **Regular Access**: Periodically test each authentication method to ensure they work

### Account Recovery

If you lose access to your primary authentication method:
1. Use any other registered signer to access your account
2. Consider adding additional backup authentication methods
3. Remove compromised signers using the remove signer functionality

### Removing Signers

You can now remove signers from your account for security or convenience:

1. Navigate to the **Signer(s)** section in Controller Settings
2. Find the signer you want to remove
3. Click the **Remove** option for that signer

> **Important**: Ensure you have at least one other working authentication method before removing a signer to avoid losing access to your account.

### Current Limitations

- **Mainnet Only**: Signer management is currently restricted to Mainnet
- **No Hierarchy**: All signers have equal access; there's no primary/secondary distinction

### Getting Help

If you encounter issues with signer management:
- Check the [Passkey Support](/controller/passkey-support.md) guide for WebAuthn-specific help
- Verify your wallet setup in the respective wallet's documentation
- Ensure you're using a supported browser and have the latest wallet extensions installed

## Developer Integration

### Social Login Technical Implementation

For developers integrating Controller's social login, the implementation includes:

**Authentication Flow:**
```typescript
// Controller automatically handles social login based on environment
const controller = new Controller({
  // Supports both "google" and "discord" AuthOptions
  signupOptions: ["webauthn", "google", "discord", "password"]
});

// Social providers are automatically available in connection flow
await controller.connect();
```

## Next Steps

- Learn about [Session Keys](/controller/sessions.md) for gasless gaming transactions
- Explore [Controller Configuration](/controller/configuration.md) options
- Set up [Usernames](/controller/usernames.md) for your account
