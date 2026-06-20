import { defineNuxtConfig } from "nuxt/config";
import { langDir } from "@supabase/i18n";

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
    defaultLocale: "zh_cn",
    locales: [
      { code: "zh_cn", name: "简体中文", file: "zh_cn.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "ja", name: "日本語", file: "ja.json" },
    ],
    langDir,
  },
});
