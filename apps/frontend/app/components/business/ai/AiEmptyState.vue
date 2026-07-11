<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="h-full flex flex-col items-center justify-center px-6 py-12 gap-5">
    <div class="size-16 rounded-2xl bg-elevated flex items-center justify-center">
      <UIcon name="i-lucide-sparkles" class="size-8 text-highlighted" />
    </div>
    <div class="text-center">
      <h2 class="text-lg font-semibold">
        {{ t("AI EmptyTitle") }}
      </h2>
      <p class="text-sm text-muted mt-1.5 max-w-sm">
        {{ t("AI EmptyDesc") }}
      </p>
    </div>
    <BusinessAiSuggestions />
  </div>
</template>
