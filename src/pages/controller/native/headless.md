---
title: Headless Controller
description: Using user-supplied signing keys with Controller for server-side and automated applications.
---

# Headless Controller

A headless Controller uses application-supplied signing keys rather than the Cartridge keychain.
This gives developers greater control over key management and enables server-side use cases.

## Use Cases

Headless Controllers are useful for:

- **Single owner, multiple accounts**: Designate one signing key as the owner of multiple Controller accounts
- **Server-side execution**: Backend services that need to execute transactions automatically
- **Automated game backends**: Bots, NPCs, or game systems that interact with the blockchain
- **Custom key management**: Applications with specific security or compliance requirements

## Setup

Here is an example of how to set up a headless Controller with Controller.c:

```c
#include "bindings/c/Controller.h"
#include "bindings/c/DiplomatOwner.h"

// String parameters use DiplomatStringView: {data, length}
DiplomatStringView private_key = {"0x1234...", 66};
DiplomatStringView app_id = {"my_app", 6};
DiplomatStringView username = {"player123", 9};
DiplomatStringView class_hash = {"0x05f...", 66};
DiplomatStringView rpc_url = {"https://api.cartridge.gg/x/starknet/sepolia", 43};
DiplomatStringView chain_id = {"0x534e5f5345504f4c4941", 22};

// Create owner from locally-generated private key
// IMPORTANT: never commit private keys in source code
DiplomatOwner_new_from_starknet_signer_result owner_result =
    DiplomatOwner_new_from_starknet_signer(private_key);
if (!owner_result.is_ok) {
    // Handle error: owner_result.err contains ControllerError*
    return;
}
DiplomatOwner *owner = owner_result.ok;

// Create a new headless Controller
Controller_new_headless_result controller_result = Controller_new_headless(
    app_id, username, class_hash, rpc_url, owner, chain_id);
if (!controller_result.is_ok) {
    // Handle error: controller_result.err contains ControllerError*
    return;
}
Controller *controller = controller_result.ok;

// Register a new Controller account onchain
// Optional parameters use Option types (is_ok = false means None)
OptionU64 session_expiration = {.is_ok = false};
OptionStringView cartridge_api_url = {.is_ok = false};

Controller_signup_result signup_result = Controller_signup(
    controller, SignerType_Starknet, session_expiration, cartridge_api_url);
if (!signup_result.is_ok) {
    // Handle error
}
```

:::warning
Never commit private keys in source code.
Store them securely using environment variables, secret managers, or hardware security modules.
:::

## Full Example

A complete working example is available in the Controller.c repository:
[C++ example](https://github.com/cartridge-gg/controller.c/tree/main/examples/cpp)
