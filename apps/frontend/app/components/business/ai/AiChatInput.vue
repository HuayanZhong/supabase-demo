<script setup lang="ts">
const { t } = useI18n();
const { status, sendMessage } = useAi();

const inputText = ref("");

function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;
  sendMessage(text);
  inputText.value = "";
}
</script>

<template>
  <div class="shrink-0 border-t border-default p-4">
    <div class="max-w-3xl mx-auto">
      <UChatPrompt v-model="inputText" :placeholder="t('AI InputPlaceholder')" @submit="handleSend">
        <UChatPromptSubmit :status="status" />
      </UChatPrompt>
    </div>
  </div>
</template>
