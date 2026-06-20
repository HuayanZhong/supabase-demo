<script setup lang="ts">
import { zh_cn, en, ja, ko } from "@nuxt/ui/locale";

const { locale, setLocale } = useI18n();

function onLocaleChange(code: string) {
  setLocale(code as "zh_cn" | "en" | "ja" | "ko");
}
</script>

<template>
  <ULocaleSelect
    :model-value="locale"
    :locales="[zh_cn, en, ja, ko]"
    @update:model-value="onLocaleChange"
  />
</template>
