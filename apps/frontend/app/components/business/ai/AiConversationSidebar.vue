<script setup lang="ts">
// AI 对话历史侧边栏
import type { NavigationMenuItem } from "@nuxt/ui";

const { t } = useI18n();
const { conversations, activeConversationId, startNewConversation, switchConversation } = useAi();

const conversationItems = computed<NavigationMenuItem[]>(() =>
  conversations.value.map((conv) => ({
    label: conv.title,
    icon: "i-lucide-message-square",
    onSelect: () => switchConversation(conv.id),
  })),
);

if (conversations.value.length === 0) {
  startNewConversation();
}
</script>

<template>
  <aside class="w-64 shrink-0 flex flex-col border-r border-default">
    <div class="p-3">
      <UButton
        block
        color="primary"
        variant="outline"
        size="sm"
        icon="i-lucide-plus"
        :label="t('AI NewConversation')"
        @click="startNewConversation"
      />
    </div>
    <div class="flex-1 overflow-y-auto p-2">
      <p class="text-xs text-muted px-2 py-1.5">
        {{ t("AI ConversationHistory") }}
      </p>
      <UNavigationMenu
        :items="conversationItems"
        orientation="vertical"
        type="single"
        :model-value="activeConversationId ?? undefined"
      />
      <p v-if="conversations.length === 0" class="text-xs text-muted text-center py-8">
        {{ t("AI NoConversations") }}
      </p>
    </div>
  </aside>
</template>
