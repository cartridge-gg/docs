---
description: Learn how to add and manage multiple authentication methods (signers) for your Cartridge Controller account, including Passkeys, Discord login, and external wallets.
title: Signer Management
---

# Signer Management

Cartridge Controller supports **multi-signer** functionality, allowing you to add multiple authentication methods to your account for enhanced security and convenience. This feature enables you to sign in using different methods while maintaining access to the same Controller account and assets.

## Overview

Multi-signer support provides several benefits:

- **Backup Authentication**: Add multiple ways to access your account in case you lose access to your primary authentication method
- **Convenience**: Use different authentication methods depending on your device or context
- **Security**: Distribute access across multiple secure authentication methods
- **Flexibility**: Choose the authentication method that works best for each situation

## Supported Signer Types

Controller supports three types of signers:

### 1. Passkey (WebAuthn)
- **Biometric authentication** using Face ID, Touch ID, or hardware security keys
- **Platform-native** security with device-based credential storage
- **Cross-platform** compatibility with password managers like Bitwarden, 1Password
- See [Passkey Support](/controller/passkey-support.md) for detailed setup information

### 2. Discord Login
- **Social authentication** using your Discord account
- **Streamlined onboarding** for users already active in gaming communities
- **Secure integration** via Turnkey wallet infrastructure
- Requires existing Discord account

### 3. External Wallets
- **MetaMask**: Popular browser extension wallet
- **Rabby**: Security-focused multi-chain wallet
- **WalletConnect**: Protocol supporting 100+ wallets via QR code or deep linking
- Leverages existing wallet setup and seed phrases

## Adding Signers

### Accessing Signer Management

> **Important**: The "Add Signer" functionality is currently disabled while under development. This feature will be re-enabled in a future update.

1. Connect to your Controller account using any existing authentication method
2. Open the **Settings** panel within the Controller interface
3. Navigate to the **Signer(s)** section
4. ~~Click **Add Signer** to begin adding a new authentication method~~ (Currently disabled)

> **Note**: When re-enabled, signer management will be available on **Mainnet only**. The "Add Signer" button will be disabled on testnet environments.

### Adding a Passkey

> **Currently Disabled**: This functionality is temporarily unavailable while under development.

~~1. In the Add Signer interface, select **Passkey**~~
~~2. Your browser will prompt you to create a new Passkey using:~~
   ~~- Device biometrics (Face ID, Touch ID, Windows Hello)~~
   ~~- Hardware security key (USB, NFC, or Bluetooth)~~
   ~~- Password manager (if configured for Passkey storage)~~
~~3. Follow your device's authentication flow~~
~~4. Once created, the Passkey will be added to your account~~

### Adding Discord Login

> **Currently Disabled**: This functionality is temporarily unavailable while under development.

~~1. Select **Discord** from the signer options~~
~~2. You'll be redirected to Discord's OAuth authorization page~~
~~3. Sign in to your Discord account if not already logged in~~
~~4. Authorize Cartridge Controller to access your Discord identity~~
~~5. The Discord login will be linked to your Controller account~~

### Adding External Wallets

> **Currently Disabled**: This functionality is temporarily unavailable while under development.

~~1. Select **Wallet** to see external wallet options~~
~~2. Choose from the supported wallet types:~~
   ~~- **MetaMask**: Ensure MetaMask extension is installed and unlocked~~
   ~~- **Rabby**: Ensure Rabby extension is installed and unlocked~~  
   ~~- **WalletConnect**: Use QR code or deep link to connect mobile/desktop wallets~~
~~3. Follow the wallet-specific connection flow~~
~~4. Sign the verification message to link the wallet to your account~~

## Managing Existing Signers

### Viewing Your Signers

The Signer(s) section displays all authentication methods associated with your account:

- **Signer type** with recognizable icons (fingerprint for Passkey, Discord logo, wallet icons)
- **Current status** indicating which signer you're currently using
- **Identifying information** such as wallet addresses (partially masked for privacy)

### Signer Information Display

Each signer card shows:
- **Type**: Passkey, Discord, MetaMask, Rabby, or WalletConnect
- **Status**: "(current)" label for the active authentication method
- **Identifier**: Shortened wallet address for external wallets, or authentication type for others

### Switching Between Signers

When connecting to your Controller:
- The connection interface will show all available authentication methods
- Select any of your registered signers to authenticate
- Your account and assets remain the same regardless of which signer you use

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
3. Remove compromised signers if necessary (feature coming soon)

### Current Limitations

- **Deletion**: Signer removal functionality is planned but not yet available
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

**External wallet connection fails**
- Verify the wallet extension is installed and unlocked
- Ensure you're on a supported network
- Check that the wallet isn't connected to another dApp

**Discord login issues**
- Verify you're logged into Discord in the same browser
- Check that third-party cookies are enabled
- Try clearing browser cache and cookies

### Getting Help

If you encounter issues with signer management:
- Check the [Passkey Support](/controller/passkey-support.md) guide for WebAuthn-specific help
- Verify your wallet setup in the respective wallet's documentation
- Ensure you're using a supported browser and have the latest wallet extensions installed

## Next Steps

- Learn about [Session Keys](/controller/sessions.md) for gasless gaming transactions
- Explore [Controller Configuration](/controller/configuration.md) options
- Set up [Usernames](/controller/usernames.md) for your account