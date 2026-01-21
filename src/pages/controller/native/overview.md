---
title: Native Integration
description: Integrate Cartridge Controller into native and mobile applications.
---

# Native Integration

Controller was initially developed as a web wallet for browser-based applications.
As the ecosystem has grown, there has been increasing demand for integrating Controller into native and mobile applications.

There are two approaches to native integration:

## Choosing an Approach

### Native Bindings (Controller.c)

Use this approach when you want true native performance and are building a native application from scratch.

[Controller.c](https://github.com/cartridge-gg/controller.c) provides FFI bindings generated from the Rust core.
These bindings enable direct integration with native programming environments.

**Platforms:**
- [React Native](/controller/native/react-native) - Cross-platform mobile via TurboModules
- [Android / Kotlin](/controller/native/android) - Native Android via UniFFI
- [iOS / Swift](/controller/native/ios) - Native iOS via UniFFI
- C / C++ - Direct FFI for game engines and native applications

**Best for:** Performance-critical apps, games, apps that need offline transaction signing.

:::info
Controller's FFI bindings are generated using [UniFFI](https://github.com/mozilla/uniffi-rs).
:::

### Web Wrappers (Capacitor)

Use this approach when you have an existing web application and want to distribute it through app stores.

[Capacitor](/controller/native/capacitor) wraps your web app in a native shell while providing access to native features through plugins.
Authentication uses the same browser-based flow as web, with deep link redirects back to your app.

**Best for:** Existing web apps, faster time-to-market, teams stronger in web than native.

## Additional Topics

- [Session Flow](/controller/native/session-flow) - Understanding browser-based session authentication
- [Headless Controller](/controller/native/headless) - Using custom signing keys for server-side or automated use cases
