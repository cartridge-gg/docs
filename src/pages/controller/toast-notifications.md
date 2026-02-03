---
showOutline: 1
description: Learn how to use the Controller Toast API to display contextual notifications including transactions, achievements, network switches, and marketplace activities.
title: Toast Notifications
---

# Toast Notifications

The Cartridge Controller SDK provides a built-in toast notification API that enables you to display contextual, user-friendly notifications directly within the controller interface. This API supports various notification types including transaction updates, achievements, network changes, and marketplace activities.

## Overview

The toast API allows you to:

- **Display Transaction Status**: Show transaction confirmation, pending, and error states
- **Network Switch Notifications**: Notify users of network changes with visual indicators
- **Achievement Celebrations**: Showcase earned achievements with XP amounts and visual flair
- **Quest Notifications**: Display quest completion and claiming status
- **Marketplace Activities**: Show purchase confirmations with item details
- **Error Handling**: Display user-friendly error messages

## Quick Start

```typescript
import { toast } from "@cartridge/controller";

// Display a simple error message
toast({
  variant: "error",
  message: "Transaction failed",
});

// Show transaction confirmation
toast({
  variant: "transaction",
  status: "confirming",
  isExpanded: true,
});
```

## API Reference

### toast(options: ToastOptions)

The main toast function accepts a `ToastOptions` object with variant-specific properties.

```typescript
import { toast } from "@cartridge/controller";

toast(options: ToastOptions);
```

## Toast Variants

### Error Toast

Display error messages with clear visual indicators. Error toasts can be made clickable to provide additional functionality.

```typescript
// Basic error toast
toast({
  variant: "error",
  message: "Transaction failed",
});

// Clickable error toast (used with errorDisplayMode: "notification")
toast({
  variant: "error",
  message: "Transaction failed",
  onClick: () => {
    // Handle click action (e.g., open modal for retry)
    console.log("Error toast clicked");
  },
});
```

**Properties:**
- `variant: "error"` - Sets the toast type to error
- `message: string` - The error message to display
- `onClick?: () => void` - Optional click handler for interactive error toasts

**Interactive Error Toasts:**
- When `onClick` is provided, the error toast becomes clickable with hover states
- Commonly used with `errorDisplayMode: "notification"` to allow users to retry failed transactions
- The toast automatically dismisses when clicked to prevent duplicate interactions

### Transaction Toast

Show transaction status updates with real-time progress indicators.

```typescript
toast({
  variant: "transaction",
  status: "confirming",
  isExpanded: true,
});
```

**Properties:**
- `variant: "transaction"` - Sets the toast type to transaction
- `status: string` - Transaction status (e.g., "confirming", "confirmed", "failed")
- `isExpanded?: boolean` - Whether to show expanded view with more details

### Network Switch Toast

Notify users of network changes with network branding.

```typescript
toast({
  variant: "network-switch",
  networkName: "Starknet Mainnet",
  networkIcon: "https://example.com/starknet-icon.png",
});
```

**Properties:**
- `variant: "network-switch"` - Sets the toast type to network switch
- `networkName: string` - Display name of the new network
- `networkIcon?: string` - URL to the network's icon image

### Achievement Toast

Celebrate user achievements with XP amounts and visual effects.

```typescript
toast({
  variant: "achievement",
  title: "First Achievement!",
  subtitle: "Earned!",
  xpAmount: 50,
  isDraft: true,
});
```

**Properties:**
- `variant: "achievement"` - Sets the toast type to achievement
- `title: string` - Achievement title
- `subtitle?: string` - Achievement subtitle or description
- `xpAmount?: number` - XP amount earned (displays with special formatting)
- `isDraft?: boolean` - Whether this is a draft/preview achievement

### Quest Toast

Display quest completion and claiming notifications.

```typescript
toast({
  variant: "quest",
  title: "First Quest!",
  subtitle: "Claimed!",
});
```

**Properties:**
- `variant: "quest"` - Sets the toast type to quest
- `title: string` - Quest title
- `subtitle?: string` - Quest status or description

### Marketplace Toast

Show marketplace purchase confirmations with item details.

```typescript
toast({
  variant: "marketplace",
  action: "purchased",
  itemName: "Cool NFT #123",
  itemImage: "https://picsum.photos/seed/adventurer/200/200",
});
```

**Properties:**
- `variant: "marketplace"` - Sets the toast type to marketplace
- `action: string` - Action performed (e.g., "purchased", "listed", "sold")
- `itemName: string` - Name of the item involved in the transaction
- `itemImage?: string` - URL to the item's image

## Usage Examples

### Transaction Flow Integration

```typescript
import { toast } from "@cartridge/controller";

async function handleTransaction() {
  try {
    // Show pending state
    toast({
      variant: "transaction",
      status: "pending",
      isExpanded: false,
    });
    
    const txHash = await executeTransaction();
    
    // Show confirming state
    toast({
      variant: "transaction",
      status: "confirming",
      isExpanded: true,
    });
    
    await waitForTransaction(txHash);
    
    // Show success (transaction toast automatically handles success)
    toast({
      variant: "transaction",
      status: "confirmed",
      isExpanded: false,
    });
    
  } catch (error) {
    // Show error
    toast({
      variant: "error",
      message: "Transaction failed: " + error.message,
    });
  }
}
```

### Achievement System Integration

```typescript
import { toast } from "@cartridge/controller";

function onAchievementEarned(achievement: Achievement) {
  toast({
    variant: "achievement",
    title: achievement.name,
    subtitle: "Achievement Unlocked!",
    xpAmount: achievement.xpReward,
    isDraft: false,
  });
}
```

### Marketplace Purchase Flow

```typescript
import { toast } from "@cartridge/controller";

async function handlePurchase(item: MarketplaceItem) {
  try {
    await purchaseItem(item);
    
    toast({
      variant: "marketplace",
      action: "purchased",
      itemName: item.name,
      itemImage: item.imageUrl,
    });
  } catch (error) {
    toast({
      variant: "error",
      message: "Purchase failed",
    });
  }
}
```

### Demo Implementation

Here's a complete demo showing all toast variants with timing:

```typescript
import { toast } from "@cartridge/controller";

function runToastDemo() {
  // Error toast
  toast({
    variant: "error",
    message: "Transaction failed",
  });

  // Transaction toast (1 second later)
  setTimeout(() => {
    toast({
      variant: "transaction",
      status: "confirming",
      isExpanded: true,
    });
  }, 1000);

  // Network switch toast (2 seconds later)
  setTimeout(() => {
    toast({
      variant: "network-switch",
      networkName: "Starknet Mainnet",
      networkIcon: "https://imagedelivery.net/0xPAQaDtnQhBs8IzYRIlNg/1b126320-367c-48ed-cf5a-ba7580e49600/logo",
    });
  }, 2000);

  // Achievement toast (3 seconds later)
  setTimeout(() => {
    toast({
      variant: "achievement",
      title: "First Achievement!",
      subtitle: "Earned!",
      xpAmount: 50,
      isDraft: true,
    });
  }, 3000);

  // Quest toast (4 seconds later)
  setTimeout(() => {
    toast({
      variant: "quest",
      title: "First Quest!",
      subtitle: "Claimed!",
    });
  }, 4000);

  // Marketplace toast (5 seconds later)
  setTimeout(() => {
    toast({
      variant: "marketplace",
      action: "purchased",
      itemName: "Cool NFT #123",
      itemImage: "https://picsum.photos/seed/adventurer/200/200",
    });
  }, 5000);
}
```

### Error Notification Integration

The toast API integrates with the Controller's error display system when `errorDisplayMode: "notification"` is configured:

```typescript
import { Controller } from "@cartridge/controller";

// Configure controller to use notification error display mode
const controller = new Controller({
  errorDisplayMode: "notification", // Show clickable error toasts
  // other options...
});

// When transactions fail, Controller automatically displays clickable error toasts
// Users can click the toast to open the modal and retry the transaction
const account = controller.account;

try {
  await account.execute(calls);
} catch (error) {
  // With notification mode, error toasts are shown automatically
  // Users can click the toast to retry via the controller modal
}
```

**Error Notification Flow:**
1. Transaction fails during execution
2. Controller displays a clickable error toast with the error message
3. User can click the toast to open the controller modal
4. Modal allows manual retry of the failed transaction
5. Toast automatically dismisses to prevent duplicate clicks

## Best Practices

### Timing and User Experience

- **Avoid Toast Spam**: Don't display multiple toasts simultaneously that could overwhelm users
- **Appropriate Duration**: Error messages should stay visible longer than success messages
- **Progressive Disclosure**: Use `isExpanded` appropriately for transaction toasts
- **Click Responsiveness**: For interactive error toasts, ensure click actions are clear and immediate

### Visual Design

- **Consistent Branding**: Use appropriate network icons and maintain visual consistency
- **Clear Messaging**: Keep toast messages concise and actionable
- **Status Clarity**: Ensure transaction status messages clearly indicate the current state
- **Interactive Indicators**: Make clickable toasts visually distinct with hover states

### Integration Patterns

```typescript
// Good: Clear, specific messages
toast({
  variant: "error",
  message: "Insufficient balance to complete transaction",
});

// Avoid: Vague error messages
toast({
  variant: "error", 
  message: "Something went wrong",
});

// Good: Meaningful achievement titles
toast({
  variant: "achievement",
  title: "Trading Expert",
  subtitle: "Complete 100 trades",
  xpAmount: 500,
});
```

## Browser Support

The toast API is built into the Controller SDK and works across all browsers that support the Controller, including:

- Chrome/Chromium browsers
- Safari (desktop and mobile)
- Firefox
- Edge

## Next Steps

- Learn about [Session Keys](/controller/sessions.md) for seamless transaction flows
- Explore [Controller Configuration](/controller/configuration.md) options
- Set up [External Wallet Integration](/controller/signer-management.md)
