import { themes as prismThemes } from "prism-react-renderer";
import type { Config } from "@docusaurus/types";
import type * as Preset from "@docusaurus/preset-classic";
import type { PluginOptions as DocsPluginOptions } from "@docusaurus/plugin-content-docs";
import { PRODUCT_DOCS } from "./config/products";

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

// Satu instance plugin-content-docs per produk (HR/ERP/MDP). Versioning aktif
// per produk; snapshot di-cut saat rilis via:
//   npm --prefix docs run docusaurus docs:version:<id> <versi>
const productDocPlugins = PRODUCT_DOCS.map((product) => [
  "@docusaurus/plugin-content-docs",
  {
    id: product.id,
    path: product.path,
    routeBasePath: product.routeBasePath,
    sidebarPath: product.sidebarPath,
    // Versioning disiapkan; sebelum versi pertama di-cut, hanya "current".
  } satisfies Partial<DocsPluginOptions>,
]);

const config: Config = {
  title: "Sentient Factory Docs",
  tagline: "Dokumentasi produk Senti — HR, ERP, MDP",
  favicon: "img/favicon.ico",

  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // D5: portal dokumentasi dilayani di subdomain sendiri.
  url: "https://docs.fr-labs.my.id",
  baseUrl: "/",

  organizationName: "sentient-factory",
  projectName: "docs",

  onBrokenLinks: "warn",

  // D2: default Bahasa Indonesia (audiens end-user/operator lokal). Locale `en`
  // disiapkan tetapi belum diterjemahkan — diisi bertahap.
  i18n: {
    defaultLocale: "id",
    locales: ["id", "en"],
    localeConfigs: {
      id: { label: "Bahasa Indonesia" },
      en: { label: "English" },
    },
  },

  presets: [
    [
      "classic",
      {
        // Instance docs "default" = dokumentasi internal/dev (route /internal).
        docs: {
          path: "docs",
          routeBasePath: "/internal",
          sidebarPath: "./sidebars.ts",
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ["rss", "atom"],
            xslt: true,
          },
          onInlineTags: "warn",
          onInlineAuthors: "warn",
          onUntruncatedBlogPosts: "warn",
        },
        theme: {
          customCss: "./src/css/custom.css",
        },
      } satisfies Preset.Options,
    ],
  ],

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  plugins: productDocPlugins as any,

  themes: ["@docusaurus/theme-mermaid"],

  markdown: {
    mermaid: true,
  },

  themeConfig: {
    image: "img/docusaurus-social-card.jpg",
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: "Sentient Factory",
      logo: {
        alt: "Sentient Factory Logo",
        src: "img/logo.svg",
      },
      items: [
        // Satu link per produk ke docs-nya. Setelah versi pertama di-cut,
        // tambahkan item { type: "docsVersionDropdown", docsPluginId: <id> }
        // pada posisi "right" untuk selector versi per produk.
        ...PRODUCT_DOCS.map((product) => ({
          type: "docSidebar" as const,
          sidebarId: `${product.id}Sidebar`,
          docsPluginId: product.id,
          position: "left" as const,
          label: product.label,
        })),
        { to: "/blog", label: "Blog", position: "left" },
        { to: "/internal", label: "Internal", position: "left" },
        {
          type: "localeDropdown",
          position: "right",
        },
        {
          href: "https://github.com/sentient-factory",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Produk",
          items: PRODUCT_DOCS.map((product) => ({
            label: product.label,
            to: product.routeBasePath,
          })),
        },
        {
          title: "Internal",
          items: [
            { label: "Getting Started", to: "/internal/intro" },
            { label: "Marketing", to: "/internal/marketing" },
            { label: "Contributing", to: "/internal/contributing" },
          ],
        },
        {
          title: "More",
          items: [
            { label: "Blog", to: "/blog" },
            { label: "GitHub", href: "https://github.com/sentient-factory" },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sentient Factory Project. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
