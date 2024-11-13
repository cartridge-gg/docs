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
    "https://og-image.preview.cartridge.gg/api/cartridge?logo=%https://www.dojoengine.org/dojo-icon.svg&title=%title&description=%description",

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
  sidebar: [
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
          text: "Sessions",
          link: "/controller/sessions",
        },
        {
          text: "Configuration",
          link: "/controller/configuration",
        },
        {
          text: "Usernames",
          link: "/controller/usernames",
        },
        {
          text: "Theming",
          link: "/controller/theming",
        },
        {
          text: "Controller Examples",
          items: [
            {
              text: "React",
              link: "/controller/examples/react",
            },
            {
              text: "Svelte",
              link: "/controller/examples/svelte",
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
      ],
    },
    {
      text: "Slot",
      items: [
        {
          text: "Getting Started",
          link: "/slot/getting-started",
        },
      ],
    },
    {
      text: "VRF",
      items: [
        {
          text: "Overview",
          link: "/vrf/overview",
        },
      ],
    },
    {
      text: "Arcade",
      items: [
        {
          text: "Overview",
          link: "/arcade/overview",
        },
        {
          text: "Achievements",
          items: [
            {
              text: "Overview",
              link: "/arcade/achievements/overview",
            },
            {
              text: "Setup",
              link: "/arcade/achievements/setup",
            },
            {
              text: "Creation",
              link: "/arcade/achievements/creation",
            },
            {
              text: "Progression",
              link: "/arcade/achievements/progression",
            },
            {
              text: "Integration",
              link: "/arcade/achievements/integration",
            },
            {
              text: "Testing",
              link: "/arcade/achievements/testing",
            },
          ],
        },
      ],
    },
  ],

  // Vite configuration
  vite: {
    plugins: [svgr()],
  },
});
