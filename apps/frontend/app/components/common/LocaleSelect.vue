<script setup lang="ts">
import { zh_cn, en, ja, ko } from "@nuxt/ui/locale";

const { locale, setLocale } = useI18n();

const availableLocales = [extendLocale(zh_cn, { code: "zh_cn" }), en, ja, ko];

function onLocaleChange(code: string) {
  setLocale(code as "zh_cn" | "en" | "ja" | "ko");
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="availableLocales"
    @update:model-value="onLocaleChange"
  />
</template>
