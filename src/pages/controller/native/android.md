---
title: Android
description: Integrate Cartridge Controller into Android applications using Kotlin and UniFFI bindings.
---

# Android Integration

Cartridge Controller provides native Android support through UniFFI-generated Kotlin bindings.
This enables seamless integration with Android applications while maintaining full access to Controller functionality.

## Prerequisites

- Android Studio with NDK installed
- Rust toolchain with Android targets:
  ```bash
  rustup target add aarch64-linux-android armv7-linux-androideabi x86_64-linux-android i686-linux-android
  ```
- cargo-ndk for cross-compilation:
  ```bash
  cargo install cargo-ndk
  ```

## Installation

Add the UniFFI-generated bindings to your Android project.
The bindings are generated from the Controller Rust library and include all necessary Kotlin classes and interfaces.

Place the generated `controller_uniffi.kt` file in your source directory and ensure the native libraries are included in `jniLibs/`.

## Core Types

The binding exposes several key types for interacting with Controller.

### FieldElement

Blockchain field elements are represented as strings:

```kotlin
typealias FieldElement = String
```

### Call

Represents a contract call:

```kotlin
data class Call(
    var contractAddress: FieldElement,
    var entrypoint: String,
    var calldata: List<FieldElement>
)
```

### Session Policies

Define permissions for session accounts:

```kotlin
data class SessionPolicy(
    var contractAddress: FieldElement,
    var entrypoint: String
)

data class SessionPolicies(
    var policies: List<SessionPolicy>,
    var maxFee: FieldElement
)
```

### SignerType

Supported signer types:

```kotlin
enum class SignerType {
    WEBAUTHN,
    STARKNET
}
```

## Creating a Controller

Initialize a headless Controller with your own signing key:

```kotlin
import com.cartridge.controller.*

val owner = Owner(privateKey = "0x...")

// Class hash for Controller contract (use appropriate version)
val classHash = "0x05f..."

val controller = controllerNewHeadless(
    appId = "my_app",
    username = "player123",
    classHash = classHash,
    rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia",
    owner = owner,
    chainId = "0x534e5f5345504f4c4941"  // SEPOLIA
)

// Access controller properties
val address: FieldElement = controller.address()
val appId: String = controller.appId()
val chainId: FieldElement = controller.chainId()
val username: String = controller.username()
```

## User Authentication

Handle user signup and chain switching:

```kotlin
// Sign up with signer type
try {
    controller.signup(
        signerType = SignerType.STARKNET,
        sessionExpiration = null,
        cartridgeApiUrl = null
    )
} catch (e: ControllerException) {
    // Handle signup error
}

// Switch to a different chain
controller.switchChain(rpcUrl = "https://api.cartridge.gg/x/starknet/mainnet")

// Disconnect the controller
controller.disconnect()
```

## Creating a SessionAccount

Create a session account for executing transactions without repeated signatures:

```kotlin
val sessionAccount = SessionAccount(
    rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia",
    privateKey = "0x...",
    address = "0x...",
    ownerGuid = "0x...",
    chainId = "0x534e5f5345504f4c4941",
    policies = SessionPolicies(
        policies = listOf(
            SessionPolicy(
                contractAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
                entrypoint = "transfer"
            )
        ),
        maxFee = "0x2386f26fc10000"
    ),
    sessionExpiration = 3600UL  // 1 hour
)
```

Alternatively, create from subscription (waits for browser authorization):

```kotlin
val sessionAccount = sessionAccountCreateFromSubscribe(
    privateKey = "0x...",
    policies = policies,
    rpcUrl = "https://api.cartridge.gg/x/starknet/sepolia",
    cartridgeApiUrl = "https://api.cartridge.gg"
)
```

## Executing Transactions

Execute transactions through the Controller or SessionAccount:

```kotlin
val calls = listOf(
    Call(
        contractAddress = "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
        entrypoint = "transfer",
        calldata = listOf(
            "0x1234...",  // recipient
            "0x100",      // amount low
            "0x0"         // amount high
        )
    )
)

// Execute via Controller
try {
    val txHash = controller.execute(calls = calls)
    println("Transaction submitted: $txHash")
} catch (e: ControllerException) {
    // Handle execution error
}

// Execute via SessionAccount
try {
    val txHash = sessionAccount.execute(calls = calls)
    println("Session transaction: $txHash")
} catch (e: ControllerException) {
    // Handle error
}

// Execute from outside (for meta-transactions)
try {
    val txHash = sessionAccount.executeFromOutside(calls = calls)
    println("External transaction: $txHash")
} catch (e: ControllerException) {
    // Handle error
}
```

### Transfer Helper

Transfer tokens directly:

```kotlin
try {
    val txHash = controller.transfer(
        recipient = "0x1234...",
        amount = "0x100"
    )
} catch (e: ControllerException) {
    // Handle transfer error
}
```

## Error Handling

The bindings define `ControllerException` for error handling:

```kotlin
try {
    controller.execute(calls = calls)
} catch (e: ControllerException.InitializationException) {
    println("Initialization failed: ${e.message}")
} catch (e: ControllerException.SignupException) {
    println("Signup failed: ${e.message}")
} catch (e: ControllerException.ExecutionException) {
    println("Execution failed: ${e.message}")
} catch (e: ControllerException.NetworkException) {
    println("Network error: ${e.message}")
} catch (e: ControllerException.StorageException) {
    println("Storage error: ${e.message}")
} catch (e: ControllerException.InvalidInput) {
    println("Invalid input: ${e.message}")
} catch (e: ControllerException.DisconnectException) {
    println("Disconnect failed: ${e.message}")
}
```

## Building Native Libraries

Build the native libraries for each Android ABI using cargo-ndk:

```bash
# Build for all supported architectures
cargo ndk -t armeabi-v7a -t arm64-v8a -t x86 -t x86_64 -o ./jniLibs build --release

# Or build for specific targets
cargo ndk -t arm64-v8a -o ./jniLibs build --release
```

Place the resulting `.so` files in your Android project:

```
app/
  src/
    main/
      jniLibs/
        arm64-v8a/
          libcontroller_uniffi.so
        armeabi-v7a/
          libcontroller_uniffi.so
        x86/
          libcontroller_uniffi.so
        x86_64/
          libcontroller_uniffi.so
```

Load the library in your application:

```kotlin
companion object {
    init {
        System.loadLibrary("controller_uniffi")
    }
}
```
