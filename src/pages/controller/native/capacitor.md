---
showOutline: 2
title: Capacitor
description: Wrap your web app for native iOS and Android distribution using Capacitor and Controller's SessionConnector.
---

# Capacitor

[Capacitor](https://capacitorjs.com/) allows you to wrap an existing web application for native iOS and Android distribution.
This approach uses the same web-based Controller integration with session-based authentication via deep links.

## When to Use Capacitor

Capacitor is ideal when:
- You have an existing web app using Controller
- You want to distribute through the App Store and Play Store
- You need access to native features (push notifications, in-app purchases, haptics)
- Your team is more comfortable with web technologies than native development

## Prerequisites

- Node.js >= 18
- Xcode (for iOS)
- Android Studio (for Android)
- An existing web app with Controller integration

## Installation

Add Capacitor to your project:

```bash
npm install @capacitor/core @capacitor/cli
npm install @capacitor/ios @capacitor/android
npm install @capacitor/app @capacitor/browser
npx cap init
```

## Configuration

Create `capacitor.config.ts` in your project root:

```typescript
import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.yourapp.id",
  appName: "Your App Name",
  webDir: "dist",  // Your build output directory
};

export default config;
```

## Controller Setup

Use `SessionConnector` instead of `ControllerConnector` for native apps.
The key difference is the `redirectUrl` parameter, which uses a custom URL scheme.

```typescript
import { constants } from "starknet";
import { SessionConnector } from "@cartridge/connector";

const controller = new SessionConnector({
  policies,
  rpc: "https://api.cartridge.gg/x/starknet/mainnet",
  chainId: constants.StarknetChainId.SN_MAIN,
  redirectUrl: "myapp://open",           // Custom URL scheme
  disconnectRedirectUrl: "myapp://open",
  signupOptions: ["google", "discord", "webauthn", "password"],
});
```

:::warning
Android does not support WebAuthn passkeys in in-app browsers.
For Android builds, remove `"webauthn"` from signup options.
:::

```typescript
import { Capacitor } from "@capacitor/core";

const isAndroid = Capacitor.getPlatform() === "android";

const signupOptions = isAndroid
  ? ["google", "discord", "password"]
  : ["google", "discord", "webauthn", "password"];
```

## Deep Link Handling

The authentication flow opens an in-app browser, then redirects back via your custom URL scheme.

### iOS Configuration

Add your URL scheme to `ios/App/App/Info.plist`:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>myapp</string>
    </array>
  </dict>
</array>
```

### Android Configuration

Add intent filters inside the main `<activity>` tag in `android/app/src/main/AndroidManifest.xml`.
You'll need both a custom scheme for basic deep links and optionally HTTPS App Links for verified domain redirects:

```xml
<activity
  android:name=".MainActivity"
  android:exported="true"
  android:launchMode="singleTask">

  <!-- Existing intent filters... -->

  <!-- Custom scheme deep link -->
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="myapp" />
  </intent-filter>

  <!-- Optional: HTTPS App Links for verified domain -->
  <intent-filter android:autoVerify="true">
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    <data android:scheme="https" android:host="yourdomain.com" android:pathPrefix="/open" />
  </intent-filter>
</activity>
```

Note: The `android:launchMode="singleTask"` ensures deep links open in the existing app instance.
For App Links with `autoVerify="true"`, you'll need to host an `assetlinks.json` file at `https://yourdomain.com/.well-known/assetlinks.json`.

### Handling the Redirect

Listen for the app URL open event and close the browser.
Check for both custom scheme and HTTPS domain redirects:

```typescript
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

App.addListener("appUrlOpen", async ({ url }) => {
  // Handle both custom scheme and HTTPS App Links
  if (url.startsWith("myapp://open") || url.startsWith("https://yourdomain.com/open")) {
    try {
      await Browser.close();
    } catch (error) {
      // Browser may already be closed
      console.debug("Browser close:", error);
    }
  }
});
```

## Build and Deploy

Build your web app, then sync with Capacitor:

```bash
npm run build
npx cap copy
```

Open in the native IDE:

:::code-group

```bash [iOS]
npx cap open ios
```

```bash [Android]
npx cap open android
```

:::

From Xcode or Android Studio, build and archive for distribution.

## Platform Detection

Use Capacitor's platform detection for conditional logic:

```typescript
import { Capacitor } from "@capacitor/core";

const platform = Capacitor.getPlatform();
const isNative = platform === "ios" || platform === "android";
const isIOS = platform === "ios";
const isAndroid = platform === "android";
```

## Additional Native Features

Capacitor provides plugins for common native features:

- `@capacitor/push-notifications` - Push notifications
- `@capacitor/preferences` - Key-value storage
- `@capacitor/haptics` - Vibration feedback
- `@capacitor/device` - Device information

Install and configure these as needed for your application.

## Example Project

For a complete production example, see the [Jokers of Neon](https://github.com/caravana-studio/jokers-of-neon-app) repository.
