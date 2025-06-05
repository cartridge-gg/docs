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

For an example, see [dope-wars](https://github.com/cartridge-gg/presets/blob/aa3a218de1c83f36bf9eb73d7ab4e099898ce1f2/configs/dope-wars/config.json#L3):

```json
{
  "origin": "dopewars.game",
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
      },
  ...
}
```

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
