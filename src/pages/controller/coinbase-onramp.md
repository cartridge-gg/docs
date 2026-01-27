---
description: Learn how to integrate Coinbase onramp functionality for fiat-to-crypto purchases within your gaming application.
title: Coinbase Onramp Integration
---

# Coinbase Onramp Integration

Cartridge Controller v0.12.0 introduces integrated Coinbase onramp functionality, enabling users to purchase cryptocurrency directly within the keychain interface using fiat payment methods. This streamlines the user experience by eliminating the need to exit your application to acquire crypto for gaming transactions.

## Overview

The Coinbase onramp integration provides:

- **Direct Fiat-to-Crypto**: Users can buy cryptocurrency using bank transfers, debit cards, and other supported payment methods
- **Automatic IP Detection**: Client IP detection for compliance with regional restrictions and optimal user experience
- **Order Management**: Complete order lifecycle tracking from creation to completion
- **Transaction Queries**: Real-time status updates and transaction monitoring
- **Seamless Integration**: Built into the existing purchase flows for starter packs and credit purchases

## useCoinbase Hook

The keychain provides a `useCoinbase` hook for managing Coinbase onramp operations. This hook is used internally by the purchase flows and provides comprehensive order management capabilities.

### Hook Features

The `useCoinbase` hook includes functionality for:

- **Order Creation**: Initialize new fiat-to-crypto purchase orders
- **Real-time Quote Fetching**: Get up-to-date pricing and fee breakdowns via `getQuote`
- **Cost Transparency**: Detailed fee breakdown showing Coinbase fees and cross-chain bridging costs
- **Transaction Monitoring**: Query transaction status and completion
- **Sandbox Mode**: Automatic toggling between production and sandbox environments based on network
- **Requirement Checks**: Verify user eligibility and regional compliance
- **IP Detection**: Automatic client IP detection for regulatory compliance

### Integration Points

The Coinbase onramp is integrated into the existing purchase flows:

1. **Starter Pack Purchases**: Available as a payment option in the wallet selection drawer
2. **Credit Purchases**: Integrated into the credit purchase interface
3. **Automatic Flow Management**: Seamlessly handles the transition from fiat payment to crypto receipt

## Enhanced Cost Transparency

Starting with the latest updates, Coinbase onramp provides detailed cost breakdowns for enhanced transparency:

- **Real-time Quote Fetching**: Automatic retrieval of current pricing and fees when Apple Pay is selected
- **Detailed Fee Breakdown**: Separate display of Coinbase service fees and cross-chain bridging costs
- **Dynamic Updates**: Quotes automatically refresh when purchase quantity changes
- **Total Cost Display**: Clear presentation of the final amount to be charged

### Fee Structure Visibility

The enhanced cost breakdown shows:

- **Base Price**: The core cost of the items being purchased
- **Protocol Fee**: Platform service fees
- **Coinbase Fee**: Service fees charged by Coinbase for fiat-to-crypto conversion
- **Bridge Fee**: Layerswap fees for cross-chain bridging to StarkNet
- **Final Total**: The complete amount charged to the user's payment method

## User Experience Flow

When users select Coinbase onramp as their payment method:

1. **Selection**: User chooses Coinbase onramp from available payment options
2. **Quote Fetching**: Real-time pricing and fee breakdown is automatically retrieved
3. **Cost Display**: Detailed breakdown shows all fees and the total amount to be charged
4. **Compliance Check**: Automatic verification of regional availability and user eligibility
5. **Order Creation**: Coinbase order is created with specified amount and destination
6. **Payment Processing**: User completes fiat payment through Coinbase's secure interface
7. **Transaction Monitoring**: Real-time tracking of crypto purchase and delivery
8. **Completion**: Cryptocurrency is delivered to user's wallet for use in game purchases

## Regional Availability

Coinbase onramp availability varies by region based on:

- **Regulatory Requirements**: Compliance with local financial regulations
- **Supported Payment Methods**: Available banking and payment options in user's region
- **Service Coverage**: Coinbase's operational coverage areas

The integration automatically detects user location via IP geolocation to determine service availability and present appropriate options.

## Benefits for Game Developers

Integrating Coinbase onramp provides several advantages:

- **Reduced Friction**: Users can acquire crypto without leaving your application
- **Higher Conversion**: Simplified path from fiat to game purchases
- **Enhanced Transparency**: Real-time fee breakdowns build user trust and reduce abandonment
- **Broader Audience**: Serves users who don't already own cryptocurrency
- **Seamless Experience**: Integrated directly into existing purchase flows
- **Compliance Handled**: Automatic regional restriction management
- **Cost Clarity**: Users know exactly what they'll pay before committing to purchase

## Security and Compliance

The Coinbase onramp integration maintains strict security standards:

- **KYC/AML Compliance**: Handled entirely by Coinbase's regulated infrastructure
- **Secure Transactions**: All fiat payments processed through Coinbase's secure payment systems
- **Regional Compliance**: Automatic compliance with local financial regulations
- **IP Detection**: Client IP validation for geographical restrictions

## Error Handling

The integration includes comprehensive error handling for:

- **Service Unavailability**: Graceful degradation when Coinbase onramp is not available in user's region
- **Order Failures**: Clear messaging and alternative payment options when orders cannot be completed
- **Network Issues**: Retry logic and fallback options for connectivity problems
- **Compliance Blocks**: Appropriate messaging when regulatory restrictions apply

## Development Testing

When testing Coinbase onramp integration:

- **Sandbox Environment**: Use Coinbase's sandbox environment for development testing (automatically enabled on testnets)
- **Quote Testing**: Verify quote fetching functionality and fee breakdown display
- **Regional Testing**: Test from different IP locations to verify regional behavior
- **Error Scenarios**: Test error conditions and fallback flows
- **Mobile Testing**: Verify mobile experience and payment flows
- **Cost Breakdown UI**: Test fee transparency components with various purchase amounts

:::note
Coinbase onramp integration is automatically included in Cartridge Controller v0.12.0+ and does not require additional configuration for basic usage.
:::

## Next Steps

- Learn about [Starter Pack Integration](/controller/starter-packs.md) for complete purchase flows
- Review [Configuration Options](/controller/configuration.md) for customization
- Explore [Credit Purchases](/controller/starter-packs.md#credit-purchases) for account top-ups
- See [Cross-Chain Payments](/controller/starter-packs.md#cross-chain-bridging-with-layerswap) for alternative payment methods