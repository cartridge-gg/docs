---
description: Learn how to customize your Cartridge Controller.
title: Controller Presets
---

This guide provides a comprehensive overview of how to create and apply custom themes, provide verified session policies, and configure Apple App Site Association for iOS integration with the Cartridge Controller.

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

Session Policies can be provided in the preset configuration, providing a smoother experience for your users. In order to submit verified policies, create a commit with them to your applications `config.json` in [`@cartridge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs).

For an example, see [dope-wars](https://github.com/cartridge-gg/presets/blob/main/configs/dope-wars/config.json):

```json
{
  "origin": "dopewars.game",
  "chains": {
    "SN_MAIN": {
      "policies": {
        "contracts": {
          "0x051Fea4450Da9D6aeE758BDEbA88B2f665bCbf549D2C61421AA724E9AC0Ced8F": {
            "name": "VRF Provider",
            "description": "Provides verifiable random functions",
            "methods": [
              {
                "name": "Request Random",
                "description": "Request a random number",
                "entrypoint": "request_random"
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

Session policies can now include paymaster predicates, which provide additional conditional logic for transaction sponsorship. This is particularly useful for games that need to sponsor transactions based on specific conditions or game state.

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
