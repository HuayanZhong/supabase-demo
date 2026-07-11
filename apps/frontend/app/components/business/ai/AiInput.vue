<script setup lang="ts">
const { t } = useI18n();
const { sendMessage, hasMessages } = useAi();

// 显式导入子组件
import AiSuggestions from "~/components/business/ai/AiSuggestions.vue";

const inputText = ref("");

/** 发送消息 */
function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;
  sendMessage(text);
  inputText.value = "";
}

/** Enter 键发送（Shift+Enter 换行） */
function onKeydown(event: KeyboardEvent) {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    handleSend();
  }
}
</script>

<template>
  <div class="border-t border-default bg-elevated px-4 py-3">
    <!-- 快捷提示词：只在没有消息时显示 -->
    <div v-if="!hasMessages" class="mb-3">
      <AiSuggestions />
    </div>

    <div class="flex items-end gap-2 max-w-4xl mx-auto">
      <UTextarea
        v-model="inputText"
        :placeholder="t('AI InputPlaceholder')"
        :rows="1"
        class="flex-1"
        :ui="{
          base: 'resize-none min-h-[40px] max-h-[120px]',
        }"
        @keydown="onKeydown"
      />
      <UButton
        icon="i-lucide-send"
        color="primary"
        variant="solid"
        :disabled="!inputText.trim()"
        class="shrink-0"
        :ui="{ base: 'size-[40px]' }"
        @click="handleSend"
      />
    </div>
  </div>
</template>
