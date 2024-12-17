---
title: Controller Achievements Integration
description: Learn how to integrate Cartridge's Achievement system into your game client, including controller configuration and UI components.
---

# Integration

## Configure the controller

The controller needs to be configured with the additional parameters:

- `namespace`: The namespace of the game.
- `slot`: The slot name associated to the torii instance.

```ts
new ControllerConnector({
  url,
  rpc,
  profileUrl,
  namespace: "dopewars", // [!code focus]
  slot: "ryomainnet", // [!code focus]
  theme,
  colorMode,
  policies,
});
```

## Open the achievements page

Integrate the achievements page in your game client

You can add this following callback to a button to open the achievements page.

```ts
const { connector } = useAccount();

const handleClick = useCallback(() => {
  if (!connector?.controller) {
    console.error("Connector not initialized");
    return;
  }
  connector.controller.openProfile("achievements");
}, [connector]);
```

## Gallery

- [DopeWars](https://github.com/cartridge-gg/dopewars/blob/mainnet/web/src/components/wallet/ConnectButton.tsx)
