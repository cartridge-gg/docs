import { defineConfig } from "vocs";
import svgr from "vite-plugin-svgr";

export default defineConfig({
  rootDir: "src",
  title: "Cartridge Documentation",
  description:
    "High Performance Infrastructure for Provable Games and Applications",
  iconUrl: "/icon.svg",
  logoUrl: "/cartridge.svg",
  ogImageUrl:
    "https://og.cartridge.gg/api/cartridge?title=%title&description=%description",
  aiCta: {
    query({ location }) {
      return `You are helping a developer build with Cartridge, high-performance infrastructure for provable games on Starknet. The developer is reading: ${location}. For coding agent support, install Cartridge skills: npx skills add cartridge-gg/agents`;
    },
  },

  theme: {
    colorScheme: "dark",
    variables: {
      color: {
        textAccent: "#ffc52a",
        background: "#0c0c0c",
        backgroundDark: "#121212",
        noteBackground: "#1a1a1a",
      },
    },
  },
  font: {
    google: "Open Sans",
  },
  socials: [
    {
      icon: "github",
      link: "https://github.com/cartridge-gg/docs",
    },
    {
      icon: "x",
      link: "https://x.com/cartridge_gg",
    },
  ],
  editLink: {
    pattern: "https://github.com/cartridge-gg/docs/blob/main/src/pages/:path",
    text: "Edit on GitHub",
  },

  // Banner configuration
  banner: {
    dismissable: true,
    backgroundColor: "#ffc52a",
    content: "Join us in [Discord](https://discord.gg/cartridge)!",
    height: "35px",
    textColor: "rgb(26, 28, 27)",
  },

  // Separate sidebars for different sections
  sidebar: {
    "/controller": [
      {
        text: "Controller",
        items: [
          {
            text: "Overview",
            link: "/controller/overview",
          },
          {
            text: "Getting Started",
            link: "/controller/getting-started",
          },
          {
            text: "Authentication",
            link: "/controller/signer-management",
          },
          {
            text: "Sessions & Policies",
            collapsed: true,
            items: [
              {
                text: "Sessions",
                link: "/controller/sessions",
              },
              {
                text: "Presets",
                link: "/controller/presets",
              },
            ],
          },
          {
            text: "Configuration",
            link: "/controller/configuration",
          },
          {
            text: "Monetization & Assets",
            collapsed: true,
            items: [
              {
                text: "Starter Packs",
                link: "/controller/starter-packs",
              },
              {
                text: "Booster Packs",
                link: "/controller/booster-packs",
              },
              {
                text: "Inventory",
                link: "/controller/inventory",
              },
              {
                text: "Coinbase Onramp",
                link: "/controller/coinbase-onramp",
              },
            ],
          },
          {
            text: "Additional Features",
            collapsed: true,
            items: [
              {
                text: "Usernames",
                link: "/controller/usernames",
              },
              {
                text: "Achievements",
                link: "/controller/achievements",
              },
              {
                text: "Quests",
                link: "/controller/quests",
              },
              {
                text: "Toast Notifications",
                link: "/controller/toast-notifications",
              },
            ],
          },
          {
            text: "Web Integration",
            collapsed: true,
            items: [
              {
                text: "React",
                link: "/controller/examples/react",
              },
              {
                text: "Svelte",
                link: "/controller/examples/svelte",
              },
            ],
          },
          {
            text: "Native Integration",
            link: "/controller/native/overview",
            collapsed: true,
            items: [
              {
                text: "Overview",
                link: "/controller/native/overview",
              },
              {
                text: "React Native",
                link: "/controller/native/react-native",
              },
              {
                text: "Android",
                link: "/controller/native/android",
              },
              {
                text: "iOS",
                link: "/controller/native/ios",
              },
              {
                text: "Capacitor",
                link: "/controller/native/capacitor",
              },
              {
                text: "Headless Controller",
                link: "/controller/native/headless",
              },
              {
                text: "Session URL Reference",
                link: "/controller/native/session-flow",
              },
            ],
          },
          {
            text: "Other Integrations",
            collapsed: true,
            items: [
              {
                text: "CLI",
                link: "/controller/examples/cli",
              },
              {
                text: "Node",
                link: "/controller/examples/node",
              },
              {
                text: "Rust",
                link: "/controller/examples/rust",
              },
              {
                text: "Telegram",
                link: "/controller/examples/telegram",
              },
            ],
          },
          {
            text: "Architecture",
            link: "/controller/architecture",
          },
        ],
      },
    ],

    // Arcade sidebar
    "/arcade": [
      {
        text: "Arcade",
        items: [
          {
            text: "Overview",
            link: "/arcade/overview",
          },
          {
            text: "Setup",
            link: "/arcade/setup",
          },
          {
            text: "Marketplace",
            link: "/arcade/marketplace",
          },
        ],
      },
    ],

    // Slot sidebar
    "/slot": [
      {
        text: "Slot",
        items: [
          {
            text: "Getting Started",
            link: "/slot/getting-started",
          },
          {
            text: "Billing",
            link: "/slot/billing",
          },
          {
            text: "Scale",
            link: "/slot/scale",
          },
          {
            text: "Paymaster",
            link: "/slot/paymaster",
          },
          {
            text: "vRNG",
            link: "/slot/vrng",
          },
          {
            text: "RPC",
            link: "/slot/rpc",
          },
          {
            text: "Observability",
            link: "/slot/observability",
          },
        ],
      },
    ],
  },

  // Twoslash configuration
  twoslash: {},

  // Vite configuration
  vite: {
    plugins: [svgr()],
  },
});
