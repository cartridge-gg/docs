---
description: Learn how to display toast notifications in your application using Cartridge Controller's built-in notification system.
title: Toast Notifications
---

# Toast Notifications

Cartridge Controller provides a built-in toast notification system that allows you to display various types of notifications to users. The toast system is designed to work seamlessly across iframe boundaries, ensuring notifications are always visible even when called from within the keychain iframe.

## Installation

Toast notifications are included with the main controller package:

```bash
npm install @cartridge/controller
```

## Basic Usage

Import the `toast` function and call it with your notification options:

```ts
import { toast } from "@cartridge/controller";

// Show a simple error message
toast({
  variant: "error",
  message: "Transaction failed. Please try again.",
});
```

## Toast Variants

The toast system supports six different variants, each designed for specific use cases:

### Error Toast

Display error messages to users:

```ts
toast({
  variant: "error",
  message: "Failed to connect to wallet",
  duration: 5000, // Optional: 5 seconds
  position: "top-right", // Optional: positioning
});
```

### Transaction Toast

Show transaction status updates:

```ts
toast({
  variant: "transaction",
  status: "confirming", // or "confirmed"
  label: "Transfer 100 ETH", // Optional: transaction description
  isExpanded: false, // Optional: expanded view
});
```

### Network Switch Toast

Notify users about network changes:

```ts
toast({
  variant: "network-switch",
  networkName: "Starknet Mainnet",
  networkIcon: "https://example.com/starknet-icon.png", // Optional
});
```

### Achievement Toast

Celebrate user achievements:

```ts
toast({
  variant: "achievement",
  title: "First Victory!",
  subtitle: "You won your first battle", // Optional
  xpAmount: 250,
  isDraft: false, // Optional: draft state
});
```

### Quest Toast

Display quest-related notifications:

```ts
toast({
  variant: "quest",
  title: "Quest Completed",
  subtitle: "The Dragon's Lair has been conquered!",
});
```

### Marketplace Toast

Show marketplace activity:

```ts
toast({
  variant: "marketplace",
  itemName: "Legendary Sword",
  itemImage: "https://example.com/sword.png",
  action: "purchased", // or "sold"
});
```

## Configuration Options

### Positioning

Toast notifications can be positioned at six different locations:

```ts
type ToastPosition = 
  | "top-left"
  | "top-right" 
  | "top-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center";

toast({
  variant: "error",
  message: "Error message",
  position: "bottom-center",
});
```

### Duration

Control how long toasts are displayed:

```ts
toast({
  variant: "error",
  message: "This will auto-dismiss after 3 seconds",
  duration: 3000, // milliseconds
});

// Persistent toast (user must manually close)
toast({
  variant: "error", 
  message: "This toast stays until manually closed",
  duration: 0, // or Infinity
});
```

### Manual Dismissal

The `toast()` function returns a dismiss function:

```ts
const dismiss = toast({
  variant: "achievement",
  title: "Achievement Unlocked!",
  xpAmount: 100,
});

// Later, dismiss manually
setTimeout(() => {
  dismiss();
}, 2000);
```

## Cross-Iframe Support

Toast notifications automatically work across iframe boundaries. When called from within an iframe (such as the Cartridge keychain), toasts will appear on the parent page to ensure maximum visibility.

```ts
// This works whether called from main page or iframe
toast({
  variant: "transaction",
  status: "confirmed",
  label: "Payment successful",
});
```

## TypeScript Support

Full TypeScript definitions are provided for all toast options:

```ts
import { ToastOptions, ToastPosition } from "@cartridge/controller";

const options: ToastOptions = {
  variant: "error",
  message: "Something went wrong",
  duration: 4000,
  position: "top-right",
};

toast(options);
```

## Best Practices

### Choose the Right Variant

- Use **error** toasts for failures and warnings
- Use **transaction** toasts for blockchain operations
- Use **network-switch** toasts for chain changes
- Use **achievement** toasts for game accomplishments
- Use **quest** toasts for quest progression
- Use **marketplace** toasts for trading activity

### Duration Guidelines

- **Error messages**: 5-8 seconds or persistent
- **Success messages**: 3-4 seconds  
- **Info messages**: 4-5 seconds
- **Critical alerts**: Persistent (duration: 0)

### Positioning Strategy

- **Errors**: Top-right or top-center for visibility
- **Success**: Bottom-right for less intrusive feedback
- **System notifications**: Top-center for importance

### Examples in Context

Here's how you might integrate toast notifications in a typical game:

```ts
import Controller, { toast } from "@cartridge/controller";

const controller = new Controller();

// Transaction handling
async function executeGameAction() {
  try {
    const dismiss = toast({
      variant: "transaction",
      status: "confirming",
      label: "Processing move...",
    });

    const result = await controller.account.execute(calls);
    
    dismiss(); // Remove confirming toast
    
    toast({
      variant: "transaction", 
      status: "confirmed",
      label: "Move successful!",
      duration: 3000,
    });
    
  } catch (error) {
    toast({
      variant: "error",
      message: `Transaction failed: ${error.message}`,
      duration: 6000,
    });
  }
}

// Achievement system
function onLevelUp(level: number, xp: number) {
  toast({
    variant: "achievement",
    title: `Level ${level} Reached!`,
    subtitle: "New abilities unlocked",
    xpAmount: xp,
  });
}

// Quest completion
function onQuestComplete(questName: string) {
  toast({
    variant: "quest",
    title: "Quest Completed",
    subtitle: questName,
  });
}
```

## Migration from Other Toast Libraries

If you're currently using libraries like `react-hot-toast` or `sonner`, the Cartridge toast system provides similar functionality with game-specific enhancements:

```ts
// Before (react-hot-toast)
import toast from 'react-hot-toast';
toast.error('Something went wrong!');

// After (Cartridge Controller)
import { toast } from '@cartridge/controller';
toast({
  variant: 'error',
  message: 'Something went wrong!',
});
```

The main advantages of using the built-in toast system:

- **Game-optimized variants**: Purpose-built for gaming scenarios
- **Cross-iframe compatibility**: Works seamlessly with Cartridge keychain
- **Consistent theming**: Matches your controller preset styling
- **Zero additional dependencies**: Included with the controller package