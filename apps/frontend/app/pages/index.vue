<script setup lang="ts">
const { locales, setLocale } = useI18n();
</script>

<template>
  <div>
    <button v-for="locale in locales" @click="setLocale(locale.code)">
      {{ locale.name }}
    </button>
    <USeparator />
    <h1>{{ $t("welcome") }}</h1>
  </div>
</template>
