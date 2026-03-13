# Docs Style Guide

This guide defines writing conventions for the Cartridge documentation site.
It is the source of truth for automated tooling (defragmentation, linting) and human contributors.

## Formatting

- One sentence per line in markdown source.
- Files must end with a single trailing newline.
- Use straight quotes (`"`, `'`), not smart/curly quotes.
- No trailing whitespace on lines.
- Use `-` for bullet lists (not `*` or `+`).
- Use 2-space indentation for nested list items.

## Page structure

- Every page must have YAML frontmatter with `showOutline: 1`, `title`, and `description`.
- Use one H1 (`#`) per page for the title, matching the frontmatter `title`.
- Use H2 (`##`) for major sections, H3 (`###`) for subsections.
- Avoid H4 and deeper nesting unless a page genuinely requires it.

## Prose

- Write in **present tense**: "This opens the modal", not "This will open the modal".
- Use **second person** ("you") for instructions, **third person** for describing system behavior ("the Controller signs the transaction").
- Use **imperative mood** for procedural steps: "Configure the provider", not "You should configure the provider".
- **Do not use contractions**: "do not", not "don't"; "you will", not "you'll".
- Use the **Oxford comma**: "credits, NFTs, and game passes".
- Prefer **"e.g."** over "for example" in parentheticals.
- Use **bold** for feature names and key concepts in running text.
  Do not use italic for emphasis (reserve it for introducing defined terms if needed).
- **Emojis** may appear in section headings for user-facing feature pages (Arcade, overview pages).
  Do not use emojis in body text or technical documentation.

## Lists

- Bullet items that are sentence fragments do not need periods.
- Bullet items that are full sentences should end with periods.
- Be consistent within a single list — don't mix fragments and full sentences.

## Terminology

### Cartridge products

| Context | Use | Don't use |
|---------|-----|-----------|
| First mention on a page | **Cartridge Controller** | "the Controller SDK", "CC" |
| Subsequent mentions | **Controller** or **the Controller** | "Cartridge Controller" repeatedly |
| The iframe/auth system | **keychain** (lowercase) | "Keychain" (unless referring to Apple Keychain specifically) |
| The JS/TS library | **Controller SDK** on first mention, then **SDK** | "Cartridge Controller SDK" (too verbose for repeated use) |
| Deployment platform | **Slot** (capitalized) | "slot" in prose (lowercase is fine in CLI commands) |
| Game hub | **Arcade** (capitalized) | "arcade" in prose |

### Ecosystem names

These are proper nouns — always capitalize in prose:

| Use | Don't use |
|-----|-----------|
| **Starknet** | "StarkNet" (outdated branding) |
| **Katana** | "katana" in prose (lowercase is fine in CLI commands) |
| **Torii** | "torii" in prose (lowercase is fine in CLI commands and config) |
| **Dojo** | "dojo" in prose |

### Third-party names

Use official branding:

| Use | Don't use |
|-----|-----------|
| **MetaMask** | "Metamask", "metamask" |
| **WalletConnect** | "Wallet Connect", "walletconnect" |
| **Layerswap** | "LayerSwap", "layer swap" |
| **React Native** | "react native", "ReactNative" |

### Feature names

| Canonical term | Variants to avoid | Notes |
|----------------|-------------------|-------|
| **starter pack** (prose) | "starterpack" in prose | `starterpack` is acceptable in code identifiers and CLI commands only |
| **Starter Packs** (heading) | "Starterpacks" | Capitalize in headings, lowercase in body text |
| **session policies** (prose) | "Session Policies" in prose | Capitalize only when referring to the `SessionPolicies` type |
| **edition** (prose) | Overusing "Game Edition" | Use "Game Edition" only on first definition; "edition" thereafter |
| **booster pack** | "Booster Pack" in prose | Capitalize in headings only |
| **vRNG** | "VRF" (legacy term) | Code may still use `vrf`; docs should say "vRNG" |
| **Merkle Drop** | "merkle drop" | Always capitalize both words |

### Hyphenation and compound words

| Use | Don't use |
|-----|-----------|
| **onchain** | "on-chain" |
| **cross-chain** | "crosschain" |
| **gasless** | "gas-free", "gas-less" |
| **multicall** | "multi-call" |
| **deep link** (noun), **deep-link** (verb/adjective) | "deeplink" |

### Technical terms — do not rename

These terms are API surface (parameter names, type names, method names).
They must match the code and should not be rewritten in prose:

**Config options:**
- `signer` — not "authentication method" or "auth option"
- `policies` — not "permissions" or "rules"
- `preset` — not "configuration preset" or "template"
- `signupOptions` — not "signup options" or "authentication options"
- `errorDisplayMode` — not "error display mode"
- `propagateSessionErrors` — not "propagate session errors"
- `lazyload` — not "lazy load" or "lazy loading"
- `shouldOverridePresetPolicies` — not "override preset policies"
- `disconnectRedirectUrl` — not "disconnect redirect URL"
- `chainId` — not "chain ID"

**Starknet terms:**
- `entrypoint` — not "entry point"
- `calldata` — not "call data"
- `felt252` — not "field element" (except when explicitly defining the term)
- `multicall` — not "multi-call" (also listed in hyphenation section)

**Type names** (always use backticks in prose):
- `SessionPolicies`, `SessionOptions`, `ControllerOptions`
- `ControllerConnector`, `SessionProvider`, `SessionConnector`
- `ResponseCodes`, `SessionToken`

When explaining these concepts to users, you may add clarifying language alongside the technical term (e.g., "the `signer` parameter specifies which authentication method to use"), but do not replace the term itself.

### Product-adjacent terms

| Use | Don't use |
|-----|-----------|
| **Cartridge account** | "Cartridge Controller account" |
| **passkey** (lowercase) | "Passkey" in prose (capitalize in headings only) |
| **paymaster** (lowercase) | "Paymaster" in prose (capitalize in headings only) |

## Cross-references

Links are the highest-risk area for automated edits.
Broken links fail the build and are hard to debug.
Follow these rules strictly.

### Path format

- **No extensions.** Use extensionless paths: `[Sessions](/controller/sessions)`, not `[Sessions](/controller/sessions.md)`.
- **Relative** for same-section links: `[Sessions](./sessions)`
- **Absolute** for cross-section links: `[Paymaster](/slot/paymaster)`

### Anchors

- Only use anchor links (`#some-heading`) when you have verified the target heading exists on the page.
- Heading anchors are auto-generated as lowercase, hyphenated slugs (e.g., `## Error Display Modes` → `#error-display-modes`).
- Do not guess at anchors.
  If unsure, link to the page without an anchor.

### When adding cross-references

- **Do not invent links during content edits.**
  If you want to suggest a cross-reference but cannot verify the target, use a TODO marker instead: `[TODO: link to error handling docs]`.
  A separate link-repair pass will resolve these.
- When replacing duplicated content with a link, verify the target page actually contains equivalent information before deleting.
- Do not add a cross-reference if the linked page only tangentially covers the topic.
  A link should save the reader from needing an explanation on the current page.

### Valid link targets

The documentation site has three sections with these base paths:

- `/controller/*` — Controller wallet, sessions, configuration, examples, native
- `/slot/*` — Slot deployments, billing, paymaster, RPC, scale, vRNG
- `/arcade/*` — Arcade overview, setup, marketplace

## Code examples

### Language tags

- Use `bash` for shell commands (not `sh` or `shell`).
- Use `typescript` for TypeScript code (not `ts`).
- Use `tsx` for React component code with JSX.
- Use `toml`, `json`, `rust`, `cairo`, `kotlin`, `swift`, `svelte` as appropriate.

### Style

- Always show import statements — do not assume imports are already present.
- Use consistent variable names: `controller`, `account`, `connector`, `policies`.
- Use double quotes in TypeScript/JavaScript code.
- Use semicolons in TypeScript/JavaScript code.
- Include type annotations for complex objects and function parameters.
- Keep comments minimal and semantic — explain "why", not "what".
- Quick-start examples may omit error handling for brevity.
  Advanced or real-world examples should include `try`/`catch`.
- Use inline code (backticks) for API names in prose: `` `connect()` ``, `` `SessionPolicies` ``.

## Admonitions

Use admonitions sparingly for genuinely important callouts:

- `:::info` — general context the reader should know
- `:::warning` — something that could cause problems if ignored
- `:::note` — supplementary information
- `:::tip` — helpful suggestion, not required

Do not use admonitions for routine information that belongs in body text.

## Content guidelines

- Do not duplicate explanations across pages.
  When content exists on a canonical page, link to it rather than restating it.
- When removing duplicated content, verify the target page actually contains the information before deleting.
- Keep code examples focused — show the minimum needed to illustrate the point.
