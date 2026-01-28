---
title: Capacitor
description: Wrap your web app for native iOS and Android distribution using Capacitor and Controller's SessionConnector.
---

# Capacitor

[Capacitor](https://capacitorjs.com/) allows you to wrap an existing web application for native iOS and Android distribution.
This approach uses Controller's SessionProvider for session-based authentication via deep links and custom URL schemes.

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

Use `SessionProvider` from `@cartridge/controller/session` for native apps.
The key difference is the `redirectUrl` parameter, which uses a custom URL scheme.

```typescript
import SessionProvider from "@cartridge/controller/session";
import { constants } from "starknet";

const policies = {
  contracts: {
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": {
      methods: [{ name: "transfer", entrypoint: "transfer" }],
    },
  },
};

const provider = new SessionProvider({
  rpc: "https://api.cartridge.gg/x/starknet/sepolia",
  chainId: constants.StarknetChainId.SN_SEPOLIA,
  redirectUrl: "myapp://session",        // Custom URL scheme
  policies,
});
```

## Browser Interception

In native Capacitor apps, you need to intercept window.open calls to ensure the system browser opens for authentication:

```typescript
import { Capacitor } from "@capacitor/core";
import { Browser } from "@capacitor/browser";

if (Capacitor.isNativePlatform()) {
  const originalOpen = window.open;
  window.open = ((url: string | URL) => {
    Browser.open({ url: url.toString() }).catch((error) => {
      console.warn("Failed to open browser", error);
    });
    return null as Window | null;
  }) as typeof window.open;

  window.addEventListener("beforeunload", () => {
    window.open = originalOpen;
  });
}
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
      <string>cartridge-session</string>
    </array>
  </dict>
</array>
```

### Android Configuration

Add intent filters inside the main `<activity>` tag in `android/app/src/main/AndroidManifest.xml`:

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
    <data android:scheme="cartridge-session" android:host="session" />
  </intent-filter>
</activity>
```

Note: The `android:launchMode="singleTask"` ensures deep links open in the existing app instance.

### Handling the Redirect

Listen for the app URL open event and process the session data:

```typescript
import { App } from "@capacitor/app";
import { Browser } from "@capacitor/browser";

const handleDeepLink = async (url: string) => {
  try {
    const parsed = new URL(url);
    const startapp = parsed.searchParams.get("startapp");
    if (!startapp) {
      return;
    }

    // Ingest the session from the redirect payload
    const stored = provider.ingestSessionFromRedirect(startapp);
    if (!stored) {
      throw new Error("Invalid session payload");
    }

    await Browser.close().catch(() => undefined);
    const account = await provider.probe();
    if (account) {
      console.log("Session ready. Address:", account.address);
    }
  } catch (error) {
    console.error("Failed to handle deep link", error);
  }
};

if (Capacitor.isNativePlatform()) {
  App.addListener("appUrlOpen", ({ url }) => {
    if (url) {
      handleDeepLink(url);
    }
  });
}
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

## Complete Example

For a complete working example with iOS project setup, see the [Capacitor example](https://github.com/cartridge-gg/controller/tree/main/examples/capacitor) in the Controller repository.

The example includes:
- Complete Capacitor configuration
- iOS project setup with deep link handling
- Session provider integration
- Error handling and browser interception

## Building and Running

Build your web app for Capacitor:

```bash
pnpm build
```

Initialize native projects (first time only):

```bash
npx cap add ios
npx cap add android
```

Sync updates after builds:

```bash
npx cap sync
```

Run with live reload:

```bash
npx cap run ios -l --external
```
