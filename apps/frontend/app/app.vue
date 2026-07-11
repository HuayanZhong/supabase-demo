<!--
应用根组件。
配置 Nuxt UI 本地化与全局 Toast 提示时长。
-->
<script setup lang="ts">
import * as locales from "@nuxt/ui/locale";

const { locale } = useI18n();
</script>

<template>
  <UApp :locale="(locales as any)[locale]" :toaster="{ duration: 1500 }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
