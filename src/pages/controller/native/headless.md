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

Here is an example of how to set up a headless Controller with the UniFFI C++ bindings:

```cpp
#include "controller.hpp"
#include <memory>
#include <string>

// IMPORTANT: never commit private keys in source code
std::string private_key = "0x1234...";
std::string app_id = "my_app";
std::string username = "player123";
std::string rpc_url = "https://api.cartridge.gg/x/starknet/sepolia";
std::string chain_id = "0x534e5f5345504f4c4941";  // SEPOLIA

// Get the latest Controller class hash
std::string class_hash = controller::get_controller_class_hash(
    controller::Version::kLatest
);

// Create owner from locally-generated private key
std::shared_ptr<controller::Owner> owner = controller::Owner::init(private_key);

// Create a new headless Controller
std::shared_ptr<controller::Controller> ctrl = controller::Controller::new_headless(
    app_id,
    username,
    class_hash,
    rpc_url,
    owner,
    chain_id
);

// Access controller properties
std::string address = ctrl->address();
std::string user = ctrl->username();

// Register a new Controller account onchain
ctrl->signup(
    controller::SignerType::kStarknet,
    std::nullopt,  // session_expiration
    std::nullopt   // cartridge_api_url
);

// Execute transactions
controller::Call call{
    "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7",
    "transfer",
    {"0x1234...", "0x100", "0x0"}
};
std::string tx_hash = ctrl->execute({call});
```

:::warning
Never commit private keys in source code.
Store them securely using environment variables, secret managers, or hardware security modules.
:::

## Full Example

A complete working example is available in the Controller.c repository:
[C++ example](https://github.com/cartridge-gg/controller.c/tree/main/examples/cpp)
