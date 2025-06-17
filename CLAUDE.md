# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production  
pnpm build

# Preview built site
pnpm preview
```

## Project Architecture

This is a Vocs-based documentation site for Cartridge - a high-performance infrastructure platform for provable games and applications. The project structure is:

### Core Components
- **Vocs Framework**: Static site generator optimized for documentation
- **React Components**: Custom components like `Homepage.tsx` for landing page
- **Markdown/MDX Pages**: Documentation content in `src/pages/`

### Content Organization
The documentation covers three main products:

1. **Controller** (`/controller/*`): Gaming-focused smart contract wallet with session keys, passkey support, paymaster functionality, achievements system, and inventory management
2. **Slot** (`/slot/*`): Horizontally scalable execution sharding platform with VRF (Verifiable Random Function) support  
3. **Arcade** (`/arcade/*`): Central hub connecting players and onchain games

### Key Configuration
- `vocs.config.ts`: Main configuration with separate sidebars for each product section
- Uses dark theme with custom color scheme (#ffc52a accent, #0c0c0c background)
- GitHub integration for edit links and social links
- Banner component for community engagement

### Styling & Assets
- Tailwind CSS configuration in `tailwind.config.cjs`
- SVG icons in `src/public/` loaded via vite-plugin-svgr
- Custom CSS variables defined in vocs theme configuration

### Package Management
- Uses pnpm as package manager
- Key dependencies: React 18, Starknet libraries, Cartridge connector
- Vocs alpha version (1.0.0-alpha.55)

When editing content, maintain the existing markdown structure and follow the established sidebar navigation patterns in `vocs.config.ts`.