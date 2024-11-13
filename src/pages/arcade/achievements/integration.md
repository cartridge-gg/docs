# Integration

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

## See also

Examples:

- [DopeWars](https://github.com/cartridge-gg/dopewars/blob/mainnet/web/src/components/wallet/ConnectButton.tsx)
