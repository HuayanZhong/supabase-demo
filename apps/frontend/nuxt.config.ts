import { defineNuxtConfig } from "nuxt/config";

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/i18n", "@nuxt/test-utils/module"],

  // 全局样式
  css: ["~/assets/css/main.css"],

  // 禁用 Google Fonts（国内无法访问）
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },

  // 国际化配置（langDir 是相对于 srcDir 的路径）
  i18n: {
    locales: [
      { code: "zh-CN", name: "简体中文", file: "zh-CN.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "ja", name: "日本語", file: "ja.json" },
      { code: "ko", name: "한국어", file: "ko.json" },
    ],
    langDir: "../../../packages/i18n/locales/",
    strategy: "no_prefix",
    defaultLocale: "zh-CN",
  },

  // TypeScript 配置：允许 .ts 扩展名导入（monorepo 中 workspace 包直接引用源码）
  typescript: {
    tsConfig: {
      compilerOptions: {
        allowImportingTsExtensions: true,
      },
    },
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabasePublishableKey: "",
      baseUrl: `http://localhost:${process.env.PORT ?? 3000}`,
    },
  },

  // 开发服务器配置
  devServer: {
    port: 3000,
  },

  // 路由规则：为 /dashboard/** 路由添加 auth 中间件
  // 并使用 dashboard 布局
  routeRules: {
    "/dashboard/**": { appLayout: "dashboard", appMiddleware: ["auth"] },
  },

  // 配置 Vite 优化依赖项，确保在 SSR 中使用 @supabase/ssr 和 zod
  vite: {
    optimizeDeps: {
      include: ["@supabase/ssr", "zod"],
    },
  },
});
