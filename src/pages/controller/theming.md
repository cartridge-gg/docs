# Theming

This guide provides a comprehensive overview of how to create and apply custom themes to the controller.

## Creating a Theme

To create a theme, teams should commit their theme config to the `configs` folder in [`@cartirdge/presets`](https://github.com/cartridge-gg/presets/tree/main/configs) with the icon and banner included.

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
