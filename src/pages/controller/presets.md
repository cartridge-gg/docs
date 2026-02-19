---
showOutline: 1
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

### Origin Configuration

The `origin` field specifies which origins are authorized to use your preset. This is important for security and preventing unauthorized use of your configuration.

#### Web Applications
For standard web applications, use your domain:
```json
{
  "origin": "https://yourdomain.com"
}
```

#### Multiple Origins
You can specify multiple origins as an array:
```json
{
  "origin": ["https://yourdomain.com", "https://staging.yourdomain.com"]
}
```

#### Capacitor Apps with Custom Hostnames
For Capacitor mobile apps using custom hostnames, include the custom hostname in your origins:

```json
{
  "origin": ["https://yourdomain.com", "my-custom-app"]
}
```

This authorizes both your web app and your Capacitor app with the custom hostname:
- **Web**: `https://yourdomain.com` 
- **iOS Capacitor**: `capacitor://my-custom-app`
- **Android Capacitor**: `https://my-custom-app`

**Note**: The default `localhost` origin (`capacitor://localhost`) is always allowed for development convenience and doesn't need to be explicitly listed in presets.

See an example pull request [`here`](https://github.com/cartridge-gg/presets/pull/8/files)

## Verified Sessions

Session Policies can be provided in the preset configuration, providing a smoother experience for your users.
In order to submit verified policies, create a commit with them to your applications `config.json` in [`@cartridge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs).

:::warning
**Policy Precedence Rules:**

1. When `shouldOverridePresetPolicies: true` and policies are provided → uses URL policies
2. When preset is configured and has policies for the current chain → uses preset policies (ignores URL policies)
3. When preset is configured but has no policies for the current chain → falls back to URL policies
4. When no preset is configured → uses URL policies

To force manually provided policies over preset policies, set `shouldOverridePresetPolicies: true`.
:::

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
