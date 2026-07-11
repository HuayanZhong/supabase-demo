<!-- AI 对话空间页面，包含对话侧边栏、消息列表和输入框。 -->
<script setup lang="ts">
definePageMeta({ title: "AI Space" });

const { messages, status, hasMessages } = useAi();
</script>

<template>
  <div class="h-[calc(100%+3rem)] flex -m-6">
    <BusinessAiConversationSidebar />

    <main class="flex-1 flex flex-col min-w-0">
      <div class="flex-1 min-h-0 overflow-y-auto px-4 py-6">
        <ClientOnly>
          <BusinessAiEmptyState v-if="!hasMessages" />
          <UChatMessages
            v-else
            :messages="messages"
            :status="status"
            should-auto-scroll
            :assistant="{ avatar: { icon: 'i-lucide-bot' } }"
            :user="{ avatar: { icon: 'i-lucide-user' }, side: 'left' }"
          />
        </ClientOnly>
      </div>

      <BusinessAiChatInput />
    </main>
  </div>
</template>
