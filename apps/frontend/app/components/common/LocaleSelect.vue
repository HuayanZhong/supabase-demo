<!--
语言选择器组件，支持中/英/日/韩四种语言。
使用 ULocaleSelect 组件配合 @nuxt/ui/locale 实现本地化切换。
-->
<script setup lang="ts">
import { zh_cn, en, ja, ko } from "@nuxt/ui/locale";

const { locale, setLocale } = useI18n();

const availableLocales = [zh_cn, en, ja, ko];

function onLocaleChange(code: string) {
  setLocale(code as "zh-CN" | "en" | "ja" | "ko");
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="availableLocales"
    @update:model-value="onLocaleChange"
  />
</template>
