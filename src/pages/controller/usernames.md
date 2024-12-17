---
description: Discover how to use Cartridge Controller's username and address lookup service, including API access, helper methods, and best practices.
title: Username Lookup
---

# Looking up Usernames / Addresses

A service for looking up usernames and addresses in the Cartridge ecosystem. You can use either the helper methods from the SDK or query the endpoint directly.

## Direct API Access

The lookup endpoint can be accessed directly via HTTP POST:

```
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"usernames": ["shinobi","sensei"]}' \
  https://api.cartridge.gg/lookup
```

Request Format
```json
{
  usernames?: string[];  // Look up addresses for usernames
  addresses?: string[];  // Look up usernames for addresses
}
```

Response Format
```json
{
  "results": [
    {
      "username": "shinobi",
      "addresses": ["0x123..."]  // Array of addresses - future support for multiple controllers/signers
    },
    {
      "username": "sensei",
      "addresses": ["0x456..."]
    }
  ]
}
```

> **Note**: The API response includes an array of addresses per username to support multiple controllers/signers in the future. Currently, the helper methods assume a 1:1 relationship and use only the first address.

## Helper Methods

For convenience, you can also use the helper methods which include caching:

```
npm install @cartridge/controller
```

```typescript
import { lookupUsernames, lookupAddresses } from '@cartridge/controller';

// Look up addresses for usernames
const userMap = await lookupUsernames(['shinobi']);
console.log(userMap.get('shinobi')); // Returns address: '0x123...'

// Look up usernames for addresses
const addressMap = await lookupAddresses(['0x123...']);
console.log(addressMap.get('0x123...')); // Returns username: 'shinobi'
```

### `lookupUsernames(usernames: string[]): Promise<Map<string, string>>`
- Fetches addresses for given usernames.
- Input: Array of usernames
- Returns: Map of username to address
- Caching: Results are automatically cached


### `lookupAddresses(addresses: string[]): Promise<Map<string, string>>`
- Fetches usernames for given addresses.
- Input: Array of addresses
- Returns: Map of address to username
- Caching: Results are automatically cached

## Limitations and Rate Limiting

When using the lookup methods or directly via the API, be aware of the following limitations and rate limiting measures:

1. **Maximum Items**: You can fetch up to 1000 items total in a single call, combining both addresses and usernames. For example:
   - 1000 addresses OR
   - 1000 usernames OR
   - Any combination (e.g., 400 addresses + 600 usernames)

2. **Rate Limiting**: The API is rate-limited to 10 requests per second to prevent overloading the server.

3. **Address Format Requirements**: 
   - Addresses must be lowercase non-zero-padded hex
   - The helper methods handle address formatting automatically


## Error Handling

The lookup methods may throw errors in the following cases:

- If you provide more than 1000 addresses in a single call.
- If you exceed the rate limit of 10 requests per second.
- If there are network issues or the API is unavailable.

Always wrap your calls to lookup methods in a try-catch block to handle potential errors gracefully.

## Performance Considerations

To optimize performance when fetching usernames:

1. Batch your requests: Instead of making multiple calls for individual addresses, group them into a single call (up to 1000 addresses).
2. Utilize the built-in caching of the helper methods: Previously fetched usernames are cached, so subsequent requests for the same addresses will be faster.
3. Be mindful of the rate limit: If you need to fetch usernames for more than 1000 addresses, implement your own throttling mechanism to avoid hitting the rate limit.

By following these guidelines, you can efficiently fetch and display usernames for controller addresses in your Cartridge-powered application.
