---
description: Learn how to add and manage multiple authentication methods (signers) for your Cartridge Controller account, including Passkeys, social login (Google, Discord), and external wallets.
title: Signer Management
---

# Signer Management

Cartridge Controller supports **multi-signer** functionality, allowing you to add multiple authentication methods to your account for enhanced security and convenience. This feature is now generally available and enables you to sign in using different methods while maintaining access to the same Controller account and assets.

## Overview

Multi-signer support provides several benefits:

- **Backup Authentication**: Add multiple ways to access your account in case you lose access to your primary authentication method
- **Convenience**: Use different authentication methods depending on your device or context
- **Security**: Distribute access across multiple secure authentication methods
- **Flexibility**: Choose the authentication method that works best for each situation

## Supported Signer Types

Controller supports four types of signers:

### 1. Passkey (WebAuthn)
- **Biometric authentication** using Face ID, Touch ID, or hardware security keys
- **Platform-native** security with device-based credential storage
- **Cross-platform** compatibility with password managers like Bitwarden, 1Password
- See [Passkey Support](/controller/passkey-support.md) for detailed setup information

### 2. Password Authentication
- **Password-based authentication** with encrypted private key storage
- **AES-GCM encryption** with PBKDF2 key derivation (100,000 iterations)
- **Testing only**: Marked for development and testing purposes only
- **Non-recoverable**: Password loss means permanent account loss
- **Minimum requirements**: 8-character minimum password length

> **⚠️ Important**: Password authentication is currently marked as "Testing Only" and should not be used for production applications. Password loss results in permanent account access loss as there are no recovery mechanisms.

### 3. Social Login

#### Google Login
- **Social authentication** using your Google account
- **Familiar experience** for users with existing Google accounts
- **Secure integration** via Turnkey wallet infrastructure
- **Automatic fallback** from popup to redirect mode for maximum browser compatibility
- Requires existing Google account

#### Discord Login
- **Social authentication** using your Discord account
- **Streamlined onboarding** for users already active in gaming communities
- **Secure integration** via Turnkey wallet infrastructure
- **Automatic fallback** from popup to redirect mode for maximum browser compatibility
- Requires existing Discord account

#### Authentication Reliability
Both Google and Discord login use an intelligent authentication flow that adapts to browser restrictions:

1. **Primary Method**: Attempts to open OAuth in a popup window for a seamless experience
2. **Fallback Method**: Automatically redirects to the OAuth provider if popups are blocked
3. **Error Handling**: Gracefully handles iframe restrictions and Content Security Policy (CSP) issues
4. **Cross-Browser Support**: Works across all modern browsers regardless of security settings

### 4. External Wallets

- **Braavos**: StarkNet-native wallet with built-in security features
- **MetaMask**: Popular browser extension wallet
- **Rabby**: Security-focused multi-chain wallet
- **Base**: Coinbase's official wallet with multi-chain support
- **WalletConnect**: Protocol supporting 100+ wallets via QR code or deep linking
- Leverages existing wallet setup and seed phrases

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
   - Complete the account creation process
3. For existing password accounts:
   - Simply enter your password to login
   - Password must match exactly (case-sensitive)

> **Security Warning**: Password accounts cannot be recovered if you lose your password. This authentication method does not provide any recovery mechanisms, making it unsuitable for production use.

### Adding Social Login

#### Adding Google Login

1. Select **Google** from the signer options
2. The system will attempt to open Google's OAuth authorization in a popup window
   - If the popup opens successfully, complete the authorization in the popup
   - If popups are blocked, you'll be automatically redirected to Google's OAuth page
3. Sign in to your Google account if not already logged in
4. Authorize Cartridge Controller to access your Google identity
5. The Google login will be linked to your Controller account

> **Note**: The authentication system automatically handles browser restrictions by falling back from popup to redirect mode when necessary. This ensures compatibility across different browsers and security settings.

#### Adding Discord Login

1. Select **Discord** from the signer options
2. The system will attempt to open Discord's OAuth authorization in a popup window
   - If the popup opens successfully, complete the authorization in the popup
   - If popups are blocked, you'll be automatically redirected to Discord's OAuth page
3. Sign in to your Discord account if not already logged in
4. Authorize Cartridge Controller to access your Discord identity
5. The Discord login will be linked to your Controller account

> **Note**: Discord authentication uses the same popup/redirect fallback system as Google login for maximum browser compatibility.

### Adding External Wallets

1. Select **Wallet** to see external wallet options
2. Choose from the supported wallet types:
   - **Argent**: StarkNet-native wallet with advanced security features and account management
   - **Braavos**: StarkNet-native wallet with built-in security features
   - **MetaMask**: Popular browser extension wallet
   - **Rabby**: Security-focused multi-chain wallet
   - **Base**: Coinbase's official wallet with multi-chain support
   - **WalletConnect**: Use QR code or deep link to connect mobile/desktop wallets
3. Follow the wallet-specific connection flow
4. Sign the verification message to link the wallet to your account

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

**Benefits for Developers:**
- Applications automatically stay current with the user's active wallet account
- No need to manually poll for account changes or ask users to reconnect
- Improved user experience with seamless account switching
- Reduced development complexity for handling multi-account scenarios

**Benefits for Users:**
- Switch accounts in your Argent or Braavos wallet without needing to reconnect
- Controller interface immediately reflects your newly selected account
- Consistent experience across all Controller-enabled applications

> **Note**: Account synchronization is currently available for StarkNet wallets (Argent and Braavos). Other external wallets maintain their existing connection behavior.

### Chain Switching for External Wallets

External wallets (Braavos, MetaMask, Rabby, Base, WalletConnect) support programmatic chain switching through the Controller interface. This allows applications to request that connected external wallets switch to a specific blockchain network.

**Supported Functionality:**
- **Automatic Chain Switching**: Applications can programmatically request external wallets to switch chains
- **Cross-Chain Compatibility**: Works with Ethereum, Starknet, and other supported networks
- **Seamless Integration**: No additional user interaction required beyond the wallet's own confirmation

**How It Works:**
1. Your application calls the chain switch method through the Controller
2. The request is forwarded to the connected external wallet
3. The wallet handles the chain switching process (may show user confirmation)
4. The application receives confirmation of the successful chain switch

**Example Usage:**
```typescript
// Switch connected external wallet to a different chain
const success = await controller.externalSwitchChain(
  walletType, // e.g., "braavos", "metamask", "rabby", "base"
  chainId     // Target chain identifier
);

if (success) {
  console.log("Chain switched successfully");
} else {
  console.log("Chain switch failed or was cancelled");
}
```

**Note:** Chain switching availability depends on the specific external wallet's capabilities and the target chain support.

### Transaction Confirmation for External Wallets

External wallets (MetaMask, Rabby, Argent, WalletConnect) support waiting for transaction confirmations through the Controller interface. This allows applications to monitor transaction status and receive confirmation when transactions are mined.

**Supported Functionality:**
- **Transaction Monitoring**: Wait for transaction confirmations with configurable timeouts
- **Multi-Wallet Support**: Works with all supported external wallet types
- **Timeout Control**: Custom timeout settings (default: 60 seconds)
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

if (response.success) {
  console.log("Transaction confirmed:", response.result);
} else {
  console.log("Transaction failed or timed out:", response.error);
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
- **External Wallet Security**: Keep your wallet seed phrases secure and never share them
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
4. Confirm the removal when prompted

> **Important**: Ensure you have at least one other working authentication method before removing a signer to avoid losing access to your account.

### Current Limitations

- **Mainnet Only**: Signer management is currently restricted to Mainnet
- **No Hierarchy**: All signers have equal access; there's no primary/secondary distinction

## Troubleshooting

### Common Issues

**"Must be on Mainnet" message**
- Signer management is only available on Mainnet
- Switch to Mainnet network to add or manage signers

**Passkey creation fails**
- Ensure your device supports WebAuthn/FIDO2
- Try using a password manager with Passkey support
- Check that your browser is up to date

**Password authentication issues**
- Verify password meets minimum 8-character requirement
- Passwords are case-sensitive - ensure correct capitalization
- Clear browser cache if experiencing persistent login issues
- Remember: Password recovery is not available - lost passwords mean permanent account loss

**External wallet connection fails**
- Verify the wallet extension is installed and unlocked
- Ensure you're on a supported network
- Check that the wallet isn't connected to another dApp

**Google login issues**
- Verify you're logged into Google in the same browser
- Check that third-party cookies are enabled
- Try clearing browser cache and cookies
- **Popup blocked**: If popups are blocked by your browser, the system will automatically redirect to Google's login page instead
- **Iframe restrictions**: If your browser blocks iframes due to Content Security Policy (CSP), the authentication will fall back to a popup window

**Discord login issues**
- Verify you're logged into Discord in the same browser
- Check that third-party cookies are enabled
- Try clearing browser cache and cookies
- **Popup blocked**: If popups are blocked by your browser, the system will automatically redirect to Discord's login page instead
- **Iframe restrictions**: If your browser blocks iframes due to Content Security Policy (CSP), the authentication will fall back to a popup window

### Getting Help

If you encounter issues with signer management:
- Check the [Passkey Support](/controller/passkey-support.md) guide for WebAuthn-specific help
- Verify your wallet setup in the respective wallet's documentation
- Ensure you're using a supported browser and have the latest wallet extensions installed

## Next Steps

- Learn about [Session Keys](/controller/sessions.md) for gasless gaming transactions
- Explore [Controller Configuration](/controller/configuration.md) options
- Set up [Usernames](/controller/usernames.md) for your account