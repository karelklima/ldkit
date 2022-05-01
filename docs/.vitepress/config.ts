import { defineConfig } from "vitepress";

export default defineConfig({
  title: "LDKit",
  description: "Effortlessly build Linked Data apps",

  themeConfig: {
    algolia: {
      apiKey: "71a5b76851e09af24c19c5e7a64ddc74",
      indexName: "ldkit-docs",
      appId: "NG7X3BXHOK",
    },
    nav: [
      {
        text: "Home",
        link: "/",
      },
      {
        text: "Guide",
        link: "/guide/",
      },
      {
        text: "Manifesto",
        link: "/manifesto/",
      },
      {
        text: "API",
        link: "/api/",
      },
      {
        text: "GitHub",
        link: "https:/karelklima.github.com/ldkit",
      },
    ],
    sidebar: {},
  },
});
