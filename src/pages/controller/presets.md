---
description: Learn how to customize your Cartridge Controller.
title: Controller Presets
---

# Presets

This guide provides a comprehensive overview of how to create and apply custom themes and provide verified session policies to the controller.

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
