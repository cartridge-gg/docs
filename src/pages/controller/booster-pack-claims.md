---
description: Learn how to claim DevConnect booster pack rewards using private keys and cryptographic signatures with Cartridge Controller's booster pack claim system.
title: Booster Pack Claims
---

# Booster Pack Claims

Booster pack claims provide a secure way for users to claim DevConnect rewards (credits, tokens, or NFTs) using cryptographic signatures. This system enables reward distribution where users receive private keys that can be used to claim their assets through the Cartridge keychain interface.

## Overview

The booster pack claim system enables:

- **Private Key-Based Claims**: Users access claims via URLs containing private keys
- **Cross-Chain Verification**: Claims originate from Ethereum addresses but are delivered to Cartridge accounts
- **Multiple Asset Types**: Support for credits, game tokens, and NFTs
- **Secure Signature Flow**: EIP-191 signature verification ensures claim authenticity
- **Animated Reveal Experience**: Special reveal animations for mystery assets

## How It Works

### Claim Flow

1. **Page Access**: User visits `/booster-pack/:privateKey` with their claim key
2. **Address Derivation**: System derives Ethereum address from the private key
3. **Asset Check**: API call to `/booster/check_for_asset` verifies what rewards are available
4. **User Connection**: If not connected, user must connect their Cartridge account
5. **Signature Generation**: System signs a claim message using the private key (EIP-191)
6. **Claim Submission**: Signed message is sent to `/booster/claim_credits` API
7. **Reward Distribution**: Backend verifies signature and grants rewards to the user's account

### Security Model

The claim system uses **EIP-191 Ethereum message signing** for security:

```typescript
// Example claim message structure
{
  account_username: "alice",
  amount: "0x96" // hex-encoded amount
}
```

- Private keys are used client-side only for signature generation
- Backend recovers the Ethereum address from the signature for verification
- No private keys are transmitted to the backend
- Each claim can only be used once per eligible address

## Supported Asset Types

The system supports various reward types:

### Credits
- **Type**: `CREDITS`
- **Amount**: 150 credits (hardcoded for security)
- **Image**: `CREDITS_150000000000000000000.png`

### Game Tokens
- **SURVIVOR**: 10 tokens → `SURVIVOR_10000000000000000000.png`
- **LORDS**: 75 tokens → `LORDS_75000000000000000000.png` 
- **NUMS**: 2000 tokens → `NUMS_2000000000000000000000.png`
- **PAPER**: 3000 tokens → `PAPER_3000000000000000000000.png`

### Special Assets
- **MYSTERY**: Animated reveal experience → `MYSTERY_ASSET.png`

## User Interface

### Claim States

The interface displays different states based on the claim progress:

- **Not Connected**: Shows "CONNECT" button
- **Connected**: Shows "CLAIM" button 
- **Claiming**: Shows "CLAIMING..." with loading state
- **Claimed**: Shows "CLAIMED" with checkmark overlay

### Post-Claim Actions

After successful claiming, users see two action buttons:

1. **VIEW IN INVENTORY**: Opens the Cartridge profile inventory page
2. **PLAY {GAME_NAME}**: Opens the associated game URL based on asset type

### Asset-to-Game Mapping

Each asset type is associated with a specific game:

- **CREDITS** → Cartridge (https://cartridge.gg)
- **SURVIVOR** → Loot Survivor (https://survivor.realms.world)
- **LORDS** → Realms (https://realms.world)
- **NUMS** → NUMS (https://nums.game)
- **PAPER** → Paper (https://paper.xyz)
- **MYSTERY_ASSET** → Arcade (https://cartridge.gg)

## API Endpoints

### Check Asset Eligibility

```http
POST /booster/check_for_asset
Content-Type: application/json

{
  "address": "0x742d35cc6867c21c2a9c7e"
}
```

**Response:**
```json
{
  "type": "credits",
  "value": 150
}
```

### Claim Credits

```http
POST /booster/claim_credits  
Content-Type: application/json

{
  "account_username": "alice",
  "message": {
    "account_username": "alice", 
    "amount": "0x96"
  },
  "signature": "0xabcd1234..."
}
```

**Response:**
```json
{
  "success": true,
  "credits_granted": 150,
  "new_balance": 1150,
  "message": "Credits claimed successfully"
}
```

## Error Handling

The system provides clear error messages for common scenarios:

- **"This address is not eligible for a booster pack"**: Address not found in eligibility list
- **"This booster pack has already been claimed"**: Claim has been used previously  
- **"Account not found. Please try again"**: User account connection issue
- **"Failed to claim rewards. Please try again"**: General claiming error

## Technical Implementation

### Client-Side Components

The claim interface is implemented in the keychain package:

- **Route**: `/booster-pack/:privateKey` in `packages/keychain/src/components/app.tsx:158`
- **Component**: `BoosterPack` in `packages/keychain/src/components/booster-pack/index.tsx`
- **Utils**: Cryptographic functions in `packages/keychain/src/components/booster-pack/utils.ts`

### Key Functions

```typescript
// Derive Ethereum address from private key
function deriveEthereumAddress(privateKey: string): string

// Sign claim message using EIP-191
async function signClaimMessage(
  privateKey: string, 
  message: ClaimCreditsMessage
): Promise<string>

// Check asset eligibility
async function checkAssetEligibility(address: string): Promise<CheckAssetResponse>

// Submit claim request
async function claimBoosterCredits(request: ClaimCreditsRequest): Promise<ClaimCreditsResponse>
```

## Integration Notes

### TODO Items

The current implementation has several planned improvements:

1. **Controller Connection**: Line 118 in `index.tsx` needs `controller.connect()` implementation
2. **Starter Pack Integration**: Line 147 has commented starter pack integration that needs activation

### Visual Assets

Asset images are hosted on Google Cloud Storage:
```
https://storage.googleapis.com/c7e-prod-static/media/devconnect/ASSET_NAME.png
```

### Animation Features

Mystery assets include special reveal animations:
- **Confetti Effects**: Color-matched particle animations
- **Sequential Reveals**: Cards reveal with staggered timing
- **Fade-up Animations**: Smooth transitions for revealed content

## Security Considerations

- Private keys are handled entirely client-side
- Signatures use standard EIP-191 format for compatibility
- Backend validation prevents double-claiming and unauthorized access
- Asset amounts are hardcoded server-side to prevent manipulation

## Related Features

- [Starter Packs](/controller/starter-packs.md): For purchased game asset bundles
- [Sessions](/controller/sessions.md): For gasless gaming transactions
- [Inventory](/controller/inventory.md): For managing claimed assets

This claim system complements the existing starter pack functionality by providing a secure way to distribute event-based rewards while maintaining the same user experience standards as other Cartridge features.