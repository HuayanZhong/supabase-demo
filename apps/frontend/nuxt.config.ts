import { defineNuxtConfig } from "nuxt/config";

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
});
