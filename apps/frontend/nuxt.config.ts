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

  // 国际化配置
  i18n: {
    locales: [
      { code: "zh-CN", name: "简体中文", file: "zh-CN.json" },
      { code: "en", name: "English", file: "en.json" },
      { code: "ja", name: "日本語", file: "ja.json" },
      { code: "ko", name: "한국어", file: "ko.json" },
    ],
    langDir,
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      supabaseUrl: "",
      supabasePublishableKey: "",
      baseUrl: `http://localhost:${process.env.PORT}`,
    },
  },
});
