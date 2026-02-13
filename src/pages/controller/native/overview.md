---
showOutline: 1
title: Native Integration
description: Choose the right connection flow for integrating Cartridge Controller into native and mobile applications.
---

# Native Integration

Controller was initially developed as a web wallet for browser-based applications.
As the ecosystem has grown, native integration is now supported across mobile and server-side platforms.

The most important decision when integrating Controller natively is **which connection flow** to use.
Your choice depends on your platform, your UX requirements, and whether you need browser-based authentication.

## Connection Flows

### Browser-Based Sessions

The most common flow for native apps.
Your app generates a local keypair, opens a browser for the user to authenticate with their Controller account, and receives a session signer back.
The session signer can then execute transactions without further user interaction.

**How it works:**

1. Generate a new keypair locally and store the private key securely
2. Open a browser to the Controller session URL, passing the public key and session policies
3. The user authenticates via WebAuthn in the browser
4. The app receives the user's Controller address via callback
5. The app signs transactions using the local private key, validated against the registered session

**Best for:** Mobile apps, games, any app where end users authenticate interactively.

**Platform guides:** [React Native](/controller/native/react-native) | [Android](/controller/native/android) | [iOS](/controller/native/ios) | [Capacitor](/controller/native/capacitor)

**Reference:** [Session URL Reference](/controller/native/session-flow) for URL parameters, policy format, and callback metadata.

### Headless (App-Managed Keys)

Your app supplies its own signing keys rather than using the Cartridge keychain.
No browser authentication is involved — the app directly controls a Controller account using a private key it manages.

**Best for:**

- Server-side execution and automated game backends
- Single owner managing multiple Controller accounts
- Bots, NPCs, or game systems that interact with the blockchain
- Applications with specific key management or compliance requirements

**Implementation:** [Headless Controller](/controller/native/headless) (C++ UniFFI bindings)

### Web Wrapper (Capacitor)

If you already have a web app using Controller, you can wrap it in a native shell for app store distribution.
Your app uses the web `SessionProvider` directly, with deep link redirects handling the browser-to-app callback.

This is not a different authentication flow — it uses the same browser-based session flow as the web SDK.
The difference is in the integration approach: you're packaging a web app rather than building a native one.

**Best for:** Existing web apps, faster time-to-market, teams stronger in web than native development.

**Platform guide:** [Capacitor](/controller/native/capacitor)

## Choosing a Flow

| Use Case | Flow | Platform Guides |
|----------|------|-----------------|
| Mobile game with player login | Browser-based sessions | [React Native](/controller/native/react-native), [Android](/controller/native/android), [iOS](/controller/native/ios) |
| Existing web app → app store | Web wrapper | [Capacitor](/controller/native/capacitor) |
| Game backend / server-side bots | Headless | [Headless Controller](/controller/native/headless) |
| Custom key management | Headless | [Headless Controller](/controller/native/headless) |

## Passkey Authentication on Native

To enable Passkey sign-in on native applications, you must configure your preset with Apple App Site Association (AASA).
This allows the operating system to recognize your app as authorized for WebAuthn credentials associated with your domain.

See the [Presets documentation](/controller/presets#apple-app-site-association) for configuration details.
