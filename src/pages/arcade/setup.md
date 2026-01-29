---
showOutline: 1
title: Arcade Setup
description: Learn how to register, configure, and index your game with Arcade, including metadata management, edition publishing, and Torii integration.
---

# Setup

## Torii Configuration

To provide a rich user experience in Arcade, we recommend enhancing your Torii configuration to enable live activity feeds, asset indexing, and leaderboards.

### ⚡️ Activity Feed

Display live player activity on your Arcade edition page.

```toml
[indexing]
transactions = true
```

### 💄 Player Asset Indexing

Index and display custom in-game assets tied to your players.

```toml
[indexing]
contracts = [
    "ERC20:0x1234...5678",
    "ERC721:0x1234...5678",
]
```

### ✨ Leaderboard Integration

Enable live leaderboards based on progression events or achievements (if implemented).

```toml
[sql]
historical = ["<YOUR-NAMESPACE>-TrophyProgression"]
```

Only add TrophyProgression if your game emits progression events through achievements.
