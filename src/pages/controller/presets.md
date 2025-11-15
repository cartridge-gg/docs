---
title: Controller Presets
description: Learn how to customize your Cartridge Controller.
---

This guide provides a comprehensive overview of how to create and apply custom themes, provide verified session policies, and configure Apple App Site Association (AASA) for iOS integration with the Cartridge Controller.

## Creating a Theme

To create a theme, teams should commit their theme config to the `configs` folder in [`@cartridge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs) with the icon and banner included.

```json
{
  "origin": "https://flippyflop.gg",
  "theme": {
    "colors": {
      "primary": "#F38332"
    },
    "cover": "cover.png",
    "icon": "icon.png",
    "name": "FlippyFlop"
  }
}
```

See an example pull request [`here`](https://github.com/cartridge-gg/presets/pull/8/files)

## Verified Sessions

Session Policies can be provided in the preset configuration, providing a smoother experience for your users.
In order to submit verified policies, create a commit with them to your applications `config.json` in [`@cartridge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs).

For an example, see [dope-wars](https://github.com/cartridge-gg/presets/blob/main/configs/dope-wars/config.json):

```json
{
  "origin": "dopewars.game",
  "chains": {
    "SN_MAIN": {
      "policies": {
        "contracts": {
          "0x051Fea...": {
            "name": "VRF Provider",
            "description": "Provides verifiable random functions",
            "methods": [
              {
                "name": "Request Random",
                "description": "Request a random number",
                "entrypoint": "request_random"
              }
            ]
          },
          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": {
            "name": "Ethereum Token",
            "description": "ETH token contract for approvals and transfers",
            "methods": [
              {
                "name": "Approve Spending",
                "description": "Allow contract to spend ETH tokens",
                "entrypoint": "approve",
                "spender": "0x1234567890abcdef1234567890abcdef12345678",
                "amount": "0x1774160BC6690000"
              },
              {
                "name": "Transfer",
                "description": "Transfer ETH tokens",
                "entrypoint": "transfer"
              }
            ]
          }
        }
      }
    }
  },
  ...
}
```

## Paymaster Predicate Support

Session policies now support **paymaster predicates**, which provide additional conditional logic for transaction sponsorship.
This is particularly useful for games that need to sponsor transactions based on specific conditions or game state.

### Using Predicates in Presets

To add paymaster predicate support to your preset configuration, include a `predicate` field in your method definition:

```json
{
  "origin": "mygame.example.com",
  "chains": {
    "SN_MAIN": {
      "policies": {
        "contracts": {
          "0x123...abc": {
            "name": "Game Contract",
            "description": "Main game contract with paymaster support",
            "methods": [
              {
                "name": "Move Player",
                "description": "Move player with conditional sponsorship",
                "entrypoint": "move_player",
                "is_paymastered": true,
                "predicate": {
                  "address": "0x456...def",
                  "entrypoint": "check_move_eligibility"
                }
              },
              {
                "name": "Attack Enemy",
                "description": "Attack with unconditional sponsorship",
                "entrypoint": "attack_enemy",
                "is_paymastered": true
              }
            ]
          }
        }
      }
    }
  }
}
```

### Predicate Structure

The `predicate` field contains:
- `address`: The contract address that contains the predicate logic
- `entrypoint`: The function name that will be called to evaluate the condition

When a transaction is submitted:
1. If a method has `is_paymastered: true` without a predicate, it will always be sponsored
2. If a method has both `is_paymastered: true` and a predicate, the predicate function will be called first
3. The transaction will only be sponsored if the predicate function returns a truthy value

This allows for sophisticated gas sponsorship policies based on game state, user eligibility, or other conditional logic.

## Token Approval Policies

Starting with controller-wasm 0.3.12+, token approval methods require explicit `spender` and `amount` fields to create an `ApprovalPolicy`. This provides enhanced security and a better user experience with spending limits.

### ApprovalPolicy Configuration

When configuring approve methods in your preset, include both `spender` and `amount` fields:

```json
{
  "origin": "mygame.example.com",
  "chains": {
    "SN_MAIN": {
      "policies": {
        "contracts": {
          "0x049d36570d4e46f48e99674bd3fcc84644ddd6b96f7c741b1562b82f9e004dc7": {
            "name": "Ethereum Token",
            "description": "ETH token for game transactions",
            "methods": [
              {
                "name": "Approve Game Contract",
                "description": "Allow game contract to spend ETH for in-game purchases",
                "entrypoint": "approve",
                "spender": "0x1234567890abcdef1234567890abcdef12345678",
                "amount": "0x1774160BC6690000"
              },
              {
                "name": "Transfer",
                "description": "Transfer ETH tokens",
                "entrypoint": "transfer"
              }
            ]
          }
        }
      }
    }
  }
}
```

### Migration from Legacy Approve Methods

If you have existing approve methods without `spender` and `amount` fields, they will continue to work but show a deprecation warning. Update them to the new format:

```json
// ❌ Legacy format (will show deprecation warning)
{
  "name": "Approve",
  "entrypoint": "approve"
}

// ✅ New format (creates ApprovalPolicy)
{
  "name": "Approve Spending",
  "entrypoint": "approve",
  "spender": "0x1234567890abcdef...",
  "amount": "0x1774160BC6690000"
}
```

**Key Benefits:**
- **Enhanced Security**: Explicit spender and amount limits
- **Better UX**: Users see spending limits in a dedicated UI
- **Future-Proof**: Prepares for stricter validation in future versions

## Apple App Site Association

The [Apple App Site Association (AASA)](https://developer.apple.com/documentation/xcode/supporting-associated-domains) configuration enables iOS app integration with Cartridge Controller, allowing for usage of Web Credentials (Passkeys) in native applications.

### Configuration

To add your iOS app to the AASA file, include the `apple-app-site-association` section in your game's `config.json`:

#### JSON Configuration

```json
{
  ...,
  "apple-app-site-association": {
    "webcredentials": {
      "apps": ["ABCDE12345.com.example.yourgame"]
    }
  },
  ...,
}
```
