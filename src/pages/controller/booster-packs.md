---
showOutline: 2
description: Learn about booster pack claims - a reward system that allows eligible users to claim game credits, tokens, and special game passes through Merkle Drop technology.
title: Booster Packs
---

# Booster Packs

Booster packs are a reward distribution system that allows eligible users to claim various game assets, credits, and exclusive game passes. Unlike starter packs which are purchased, booster packs are claimed for free by users who meet specific eligibility criteria, often based on holding certain NFTs or participating in events.

## Overview

Booster packs enable:

- **Free Asset Claims**: Eligible users can claim rewards without payment
- **Cross-Chain Eligibility**: Check eligibility using Ethereum addresses from various events or NFT holdings
- **Multiple Reward Types**: Claim fungible tokens (LORDS, NUMS, PAPER), game credits, or exclusive game passes
- **Merkle Drop Technology**: Secure, verifiable claiming using cryptographic proofs
- **Game Integration**: Special game passes for supported games like Loot Survivor 2 and NUMS
- **Animated Reveals**: Interactive UI with card reveals for mystery asset types

## How Booster Packs Work

### Eligibility Verification

Booster packs use an eligibility system where users must meet specific criteria to claim rewards:

```typescript
// Check if an Ethereum address is eligible for booster pack rewards
const eligibilityResponse = await checkAssetEligibility(ethereumAddress);
// Returns: { value: number, type: string } (e.g., { value: 150, type: "credits" })
```

### Supported Reward Types

Booster packs can contain various types of rewards:

**Fungible Tokens:**
- `CREDITS`: Platform credits for gasless transactions (typically 150)
- `LORDS`: Realms ecosystem token (75 tokens)
- `NUMS`: NUMS game token (2000 tokens)  
- `PAPER`: Dope Wars token (3000 tokens)
- `SURVIVOR`: Loot Survivor token (10 tokens)

**Game Passes:**
- `LS2_GAME`: Loot Survivor 2 exclusive game pass
- `NUMS_GAME`: NUMS game pass

**Special Types:**
- `MYSTERY_ASSET`: Contains multiple random game passes with reveal animation

### Claim Process

The claiming process involves several steps:

1. **Eligibility Check**: System verifies if the user's Ethereum address qualifies for rewards
2. **Authentication**: User must be connected to their Cartridge account
3. **Merkle Proof Validation**: Claims are validated using merkle tree proofs
4. **Asset Distribution**: Eligible rewards are distributed to the user's Cartridge account
5. **Animation**: For mystery assets, an interactive reveal animation shows claimed game passes

## Technical Implementation

### Credit Claims API

For credit-type booster packs, a special API call is made to grant credits:

```typescript
interface ClaimCreditsMessage {
  account_username: string;
  amount: string; // hex format (e.g., "0x96" for 150)
}

interface ClaimCreditsRequest {
  account_username: string;
  message: ClaimCreditsMessage;
  signature: string; // EIP-191 signature from private key
}

// Example claim flow
const message: ClaimCreditsMessage = {
  account_username: "player123",
  amount: "0x96", // 150 credits in hex
};

const signature = await signClaimMessage(privateKey, message);

const response = await claimBoosterCredits({
  account_username: "player123", 
  message,
  signature,
});
```

### Merkle Drop Integration

Booster packs use the same Merkle Drop technology as claimable starter packs:

- **Cryptographic Proofs**: Claims are validated using merkle proofs
- **Cross-Chain Support**: Eligibility can originate from multiple blockchain networks
- **Signature Verification**: EIP-191 signatures verify ownership of claiming addresses
- **Forwarder Contracts**: Assets are distributed through verified smart contracts

## User Experience

### Booster Pack Interface

When users access a booster pack:

1. **Loading State**: System checks asset eligibility for the provided address
2. **Asset Preview**: Displays the eligible reward type with appropriate imagery
3. **Connection Flow**: If not authenticated, redirects to connect their Cartridge account
4. **Claim Button**: Single-click claiming once eligibility and authentication are confirmed
5. **Success State**: Shows claimed status with options to use rewards

### Mystery Asset Reveals

For mystery asset booster packs, users experience:

- **Suspenseful Animation**: 2-second delay before reveal begins
- **Sequential Card Reveals**: Multiple game passes revealed one by one
- **Confetti Effects**: Celebratory visual feedback during reveals
- **Interactive Cards**: Claimed game passes become clickable to launch games

### Game Integration

Claimed game passes integrate directly with supported games:

- **Loot Survivor 2**: Game passes provide tournament entry tokens
- **NUMS**: Access to specific game modes or levels
- **Automatic Launch**: Claimed passes can directly open the associated game

## Error Handling

Common error scenarios and their handling:

```typescript
try {
  await claimBoosterCredits(request);
} catch (error) {
  // Handle specific error cases
  if (error.message.includes("already claimed")) {
    // User has already claimed this booster pack
  } else if (error.message.includes("not eligible")) {
    // Address doesn't meet eligibility criteria
  } else if (error.message.includes("Account not found")) {
    // User's Cartridge account couldn't be found
  }
}
```

## Integration Notes

### Asset Eligibility

Asset eligibility is typically determined by:
- **NFT Holdings**: Owning specific NFTs or collections
- **Event Participation**: Participating in airdrops, campaigns, or events  
- **Whitelist Inclusion**: Being included in predetermined distribution lists
- **Time-Based Claims**: Meeting criteria during specific time windows

### Security Considerations

- **Private Key Signing**: Claims require cryptographic signatures proving address ownership
- **One-Time Claims**: Most booster packs can only be claimed once per eligible address
- **Server Validation**: Backend services verify merkle proofs and prevent double-spending
- **Rate Limiting**: API endpoints include protection against abuse

## Differences from Starter Packs

While both use Merkle Drop technology, booster packs differ from starter packs in key ways:

| Feature | Booster Packs | Starter Packs |
|---------|---------------|---------------|
| **Cost** | Free (for eligible users) | Paid or free |
| **Eligibility** | Based on external criteria | Open to all users |
| **Content** | Predetermined rewards | Customizable bundles |
| **UI Experience** | Claim-focused with reveals | Purchase-focused |
| **Integration** | Event/campaign-based | Game monetization |

## Related Documentation

- [Starter Packs](/controller/starter-packs.md) - For purchasable asset bundles
- [Sessions](/controller/sessions.md) - For gasless gaming experiences using claimed credits
- [Achievements](/controller/achievements) - For other reward and progression systems

## Getting Help

If you encounter issues with booster pack integration:
- Verify eligibility criteria are met for the claiming address
- Check that the user's Cartridge account is properly authenticated
- Ensure merkle proofs are valid and haven't expired
- Review browser console for detailed error messages
- Confirm API endpoints are accessible and responding correctly
