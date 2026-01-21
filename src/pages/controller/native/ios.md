---
title: iOS
description: Integrate Cartridge Controller into iOS applications using Swift and UniFFI bindings.
---

# iOS Integration

Cartridge Controller provides native iOS support through UniFFI-generated Swift bindings.
This enables seamless integration with iOS applications while maintaining full access to Controller functionality.

## Prerequisites

- Xcode 15+
- iOS 17+ deployment target
- Swift 5.5+
- Rust toolchain (for building the library)

## Installation

Build the Swift bindings from the Controller.c repository:

```bash
cd controller.c
cargo build --release
./scripts/build_swift.sh
```

This generates:
- `libcontroller_uniffi.dylib` - The native library
- `controller_uniffi.swift` - Swift wrapper
- `controller_uniffiFFI.h` - C headers for bridging

Add these files to your Xcode project and configure:
- **Bridging Header:** Include `controller_uniffiFFI.h`
- **Other Linker Flags:** `-lcontroller_uniffi`
- **Library Search Paths:** Path to `target/release/`

## Core Types

### FieldElement

Blockchain field elements are represented as strings:

```swift
typealias ControllerFieldElement = String
```

### Call

Represents a contract call:

```swift
struct Call {
    var contractAddress: ControllerFieldElement
    var entrypoint: String
    var calldata: [ControllerFieldElement]
}
```

### Session Policies

Define permissions for session accounts:

```swift
struct SessionPolicy {
    var contractAddress: ControllerFieldElement
    var entrypoint: String
}

struct SessionPolicies {
    var policies: [SessionPolicy]
    var maxFee: ControllerFieldElement
}
```

## Creating a ControllerAccount

Initialize a headless ControllerAccount with your own signing key:

```swift
import Foundation

let owner = try Owner(privateKey: "0x...")
let classHash = try getControllerClassHash(version: .latest)

let controller = try ControllerAccount.newHeadless(
    appId: "my_app",
    username: "player123",
    classHash: classHash,
    rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    owner: owner,
    chainId: "0x534e5f5345504f4c4941"  // SEPOLIA
)

// Access controller properties
let address = try controller.address()
let username = try controller.username()
```

## Creating a SessionAccount

Generate a keypair and create a session via browser authorization:

```swift
// Generate random private key
var bytes = [UInt8](repeating: 0, count: 32)
SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes)
let privateKey = "0x" + bytes.map { String(format: "%02x", $0) }.joined()
let publicKey = try getPublicKey(privateKey: privateKey)

// Define policies
let policies = SessionPolicies(
    policies: [
        SessionPolicy(
            contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
            entrypoint: "transfer"
        )
    ],
    maxFee: "0x2386f26fc10000"
)

// Create session from API subscription
let session = try SessionAccount.createFromSubscribe(
    privateKey: privateKey,
    policies: policies,
    rpcUrl: "https://api.cartridge.gg/x/starknet/sepolia",
    cartridgeApiUrl: "https://api.cartridge.gg"
)

// Check session metadata
let address = session.address()
let username = session.username()
let expiresAt = session.expiresAt()
let isExpired = session.isExpired()
```

## Executing Transactions

Execute transactions through the Controller or SessionAccount:

```swift
let call = Call(
    contractAddress: "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    entrypoint: "transfer",
    calldata: ["0x1234...", "0x1000", "0x0"]
)

// Via Controller
let txHash = try controller.execute(calls: [call])

// Via SessionAccount (no signature required)
let txHash = try session.executeFromOutside(calls: [call])
```

## Error Handling

The bindings define `ControllerError` for error handling:

```swift
do {
    try controller.execute(calls: [call])
} catch let error as ControllerError {
    switch error {
    case .InitializationError(let message):
        print("Init failed: \(message)")
    case .SignupError(let message):
        print("Signup failed: \(message)")
    case .ExecutionError(let message):
        print("Execution failed: \(message)")
    case .NetworkError(let message):
        print("Network error: \(message)")
    case .StorageError(let message):
        print("Storage error: \(message)")
    case .InvalidInput(let message):
        print("Invalid input: \(message)")
    case .DisconnectError(let message):
        print("Disconnect failed: \(message)")
    }
}
```

## Utility Functions

```swift
// Derive public key from private key
let publicKey = try getPublicKey(privateKey: privateKey)

// Convert signer to GUID
let guid = try signerToGuid(privateKey: privateKey)

// Get Controller class hash
let classHash = try getControllerClassHash(version: .latest)

// Validate felt format
let isValid = try validateFelt(felt: "0x123...")

// Check if storage exists for app
let hasStorage = try controllerHasStorage(appId: "my_app")
```

## Example Projects

Complete working examples are available in the Controller.c repository:
- [Swift examples](https://github.com/cartridge-gg/controller.c/tree/main/examples/swift)
- [iOS app examples](https://github.com/cartridge-gg/controller.c/tree/main/examples/ios-app)
