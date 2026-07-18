<script setup lang="ts">
// AI 页面空状态提示 — 文字字标 + 淡出描述
const { t } = useI18n();
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center px-6 py-12 gap-5">
    <!-- "Growth OS" 文字字标 -->
    <div class="select-none font-bold tracking-tight leading-none text-center" aria-hidden="true">
      <span
        class="text-[100px] md:text-[120px] bg-linear-to-br from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent"
      >
        Growth OS
      </span>
    </div>

    <p class="text-sm text-muted-foreground">
      {{ t("AI EmptyDesc") }}
    </p>
  </div>
</template>
