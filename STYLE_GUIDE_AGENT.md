# Docs Style Guide (Agent Reference)

Condensed version of STYLE_GUIDE.md for use in agent prompts.
For the full guide, see STYLE_GUIDE.md.

## Formatting

- One sentence per line. Trailing newline at EOF. Straight quotes only.
- Bullets use `-`. Indent nested items 2 spaces.
- Code blocks: `bash` (not `sh`/`shell`), `typescript` (not `ts`), `tsx` for JSX.
- Present tense, no contractions, Oxford comma, "e.g." over "for example".

## Terminology

**Products — first mention / subsequent:**
- **Cartridge Controller** → **Controller** or **the Controller**
- **Controller SDK** → **SDK**
- **Slot**, **Arcade**, **Starknet**, **Katana**, **Torii**, **Dojo** — always capitalized in prose
- **MetaMask**, **WalletConnect**, **Layerswap**, **React Native** — official branding

**Features (prose / heading):**
- starter pack / Starter Packs (not "starterpack" in prose)
- session policies / Session Policies (capitalize only for `SessionPolicies` type)
- edition (not "Game Edition" repeatedly — use once to define, then "edition")
- booster pack, vRNG (not VRF), Merkle Drop, Cartridge account (not "Cartridge Controller account")
- passkey, paymaster — lowercase in prose

**Compounds:** onchain, cross-chain, gasless, multicall, deep link (noun) / deep-link (adj)

**Do not rename API terms.**
Any term that appears as a parameter name, config key, or type name in code blocks must be preserved exactly in prose.
Use backticks when referencing them.
High-risk examples: `signer` (not "authentication method"), `policies` (not "permissions"), `entrypoint` (not "entry point"), `calldata` (not "call data"), `lazyload` (not "lazy load"), `signupOptions` (not "signup options").

## Cross-references

**This is the highest-risk area. Broken links fail the build.**

- No `.md`/`.mdx` extensions: `[Sessions](/controller/sessions)` not `[Sessions](/controller/sessions.md)`
- Relative for same-section: `[Sessions](./sessions)`
- Absolute for cross-section: `[Paymaster](/slot/paymaster)`
- **Do not guess anchors.** Only use `#heading-slug` if you have verified the heading exists. If unsure, link without an anchor or use `[TODO: link to X]`.
- **Do not invent links during content edits.** Use `[TODO: link to X]` for uncertain targets.
- Before replacing content with a link, verify the target page contains equivalent information.
- Valid sections: `/controller/*`, `/slot/*`, `/arcade/*`
