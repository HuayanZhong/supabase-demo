<script setup lang="ts">
definePageMeta({
  title: "AI Space",
});

const { t } = useI18n();
const {
  messages,
  status,
  conversations,
  activeConversationId,
  hasMessages,
  sendMessage,
  startNewConversation,
  switchConversation,
} = useAi();

// 显式导入子组件
import AiSuggestions from "~/components/business/ai/AiSuggestions.vue";

const inputText = ref("");

function handleSend() {
  const text = inputText.value.trim();
  if (!text) return;
  sendMessage(text);
  inputText.value = "";
}

// 初始化默认对话
if (conversations.value.length === 0) {
  startNewConversation();
}
</script>

<template>
  <div class="h-full flex -m-6">
    <!-- 对话历史侧边栏 -->
    <aside class="w-72 border-r border-default bg-elevated flex flex-col shrink-0">
      <!-- 顶部标题 + 新建按钮 -->
      <div class="p-4 border-b border-default">
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

      <!-- 对话列表 -->
      <div class="flex-1 overflow-y-auto p-2 space-y-0.5">
        <p class="text-xs text-muted px-2 py-2">
          {{ t("AI ConversationHistory") }}
        </p>

        <button
          v-for="conv in conversations"
          :key="conv.id"
          class="w-full flex items-start gap-2.5 rounded-lg px-3 py-2.5 text-left transition-colors cursor-pointer"
          :class="
            conv.id === activeConversationId
              ? 'bg-primary/10 text-primary'
              : 'text-default hover:bg-secondary/10'
          "
          @click="switchConversation(conv.id)"
        >
          <UIcon
            name="i-lucide-message-square"
            class="size-4 shrink-0 mt-0.5"
            :class="conv.id === activeConversationId ? 'text-primary' : 'text-muted'"
          />
          <div class="min-w-0 flex-1">
            <p
              class="text-sm truncate"
              :class="conv.id === activeConversationId ? 'font-medium' : 'font-normal'"
            >
              {{ conv.title }}
            </p>
            <p v-if="conv.lastMessage" class="text-xs text-muted truncate mt-0.5">
              {{ conv.lastMessage }}
            </p>
          </div>
        </button>

        <p v-if="conversations.length === 0" class="text-xs text-muted text-center py-8">
          {{ t("AI NoConversations") }}
        </p>
      </div>
    </aside>

    <!-- 对话主区域 -->
    <div class="flex-1 flex flex-col min-w-0 bg-background">
      <ClientOnly>
        <!-- 空状态 -->
        <div v-if="!hasMessages" class="flex-1 flex flex-col items-center justify-center px-6">
          <div class="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
            <UIcon name="i-lucide-sparkles" class="size-8 text-primary" />
          </div>
          <h3 class="text-lg font-semibold text-highlighted">
            {{ t("AI EmptyTitle") }}
          </h3>
          <p class="text-sm text-muted mt-1 max-w-xs text-center">
            {{ t("AI EmptyDesc") }}
          </p>
        </div>

        <!-- 消息列表 -->
        <UChatMessages
          v-else
          :messages="messages"
          :status="status"
          should-auto-scroll
          :assistant="{
            avatar: { icon: 'i-lucide-bot' },
          }"
          :user="{
            avatar: { icon: 'i-lucide-user' },
          }"
        />
      </ClientOnly>

      <!-- 底部输入区 -->
      <div class="border-t border-default bg-elevated px-4 py-3">
        <!-- 快捷提示词：只在没有消息时显示 -->
        <div v-if="!hasMessages" class="mb-3">
          <AiSuggestions />
        </div>

        <div class="max-w-4xl mx-auto">
          <UChatPrompt
            v-model="inputText"
            :placeholder="t('AI InputPlaceholder')"
            @submit="handleSend"
          >
            <template #trailing>
              <UChatPromptSubmit :status="status" />
            </template>
          </UChatPrompt>
        </div>
      </div>
    </div>
  </div>
</template>
