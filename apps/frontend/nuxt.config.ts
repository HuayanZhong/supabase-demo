import { defineNuxtConfig } from "nuxt/config";
import { zh, en } from "@supabase/i18n/src/index.ts";

export default defineNuxtConfig({
  modules: ["@nuxt/ui", "@nuxt/fonts", "@nuxt/image", "@nuxtjs/i18n"],

  // 全局样式
  css: ["~/assets/css/main.css"],

  // 禁用 Google Fonts（国内无法访问）
  fonts: {
    providers: {
      google: false,
      googleicons: false,
    },
  },

  i18n: {
    defaultLocale: "zh",
    locales: [
      { code: "zh", name: "中文", files: [zh] },
      { code: "en", name: "English", files: [en] },
    ],
  },
});
