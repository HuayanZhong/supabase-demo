<script setup lang="ts">
const { t } = useI18n();
const { suggestions, sendMessage } = useAi();

// 点击快捷提示词自动发送
function handleSuggestionClick(textKey: string) {
  sendMessage(t(textKey));
}
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="grid grid-cols-2 gap-2">
      <button
        v-for="s in suggestions"
        :key="s.id"
        class="flex items-start gap-2.5 rounded-xl border border-default bg-elevated px-3.5 py-2.5 text-left text-sm text-default hover:bg-elevated hover:border-default transition-colors cursor-pointer"
        @click="handleSuggestionClick(s.textKey)"
      >
        <UIcon :name="s.icon" class="size-4 text-primary shrink-0 mt-0.5" />
        <span>{{ t(s.textKey) }}</span>
      </button>
    </div>
  </div>
</template>
