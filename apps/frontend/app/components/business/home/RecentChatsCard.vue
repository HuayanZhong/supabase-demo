<script setup lang="ts">
// 最近对话列表卡片
const { t } = useI18n();

const chats = [
  {
    name: t("Chat AiAssistant"),
    avatar: "i-lucide-bot",
    message: t("Chat AiMessage"),
    time: "10:30",
    unread: 0,
  },
  {
    name: t("Chat Mentor"),
    avatar: "i-lucide-user",
    message: t("Chat MentorMessage"),
    time: t("Time Yesterday"),
    unread: 2,
  },
  {
    name: t("Chat TeamGroup"),
    avatar: "i-lucide-users",
    message: t("Chat TeamMessage"),
    time: t("Time Yesterday"),
    unread: 0,
  },
];
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden">
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-4">
      <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
        <UIcon name="i-lucide-message-circle" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("RecentChats") }}</span>
    </div>
    <div class="px-5 pb-5 space-y-2">
      <div
        v-for="chat in chats"
        :key="chat.name"
        class="flex items-center gap-3 p-3 rounded-lg bg-elevated cursor-pointer transition-all duration-150 hover:bg-muted/50 hover:shadow-sm"
      >
        <UChip :show="chat.unread > 0" :text="chat.unread" size="sm">
          <UAvatar :icon="chat.avatar" size="sm" />
        </UChip>
        <div class="flex-1 min-w-0">
          <div class="flex items-center justify-between">
            <p class="text-sm font-medium text-default truncate">
              {{ chat.name }}
            </p>
            <span class="text-xs text-muted shrink-0 ml-2">{{ chat.time }}</span>
          </div>
          <p class="text-xs text-muted truncate mt-0.5">{{ chat.message }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
