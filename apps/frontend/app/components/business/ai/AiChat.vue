<script setup lang="ts">
const { t } = useI18n();
const { messages, hasMessages } = useAi();

const scrollContainer = ref<HTMLElement | null>(null);

/** 新消息出现时自动滚动到底部 */
watch(
  () => messages.value.length,
  async () => {
    await nextTick();
    if (scrollContainer.value) {
      scrollContainer.value.scrollTop = scrollContainer.value.scrollHeight;
    }
  },
);

/** 格式化时间 */
function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, "0");
  const m = date.getMinutes().toString().padStart(2, "0");
  return `${h}:${m}`;
}

/** 按日期分组消息顶部是否显示日期分隔 */
function shouldShowDateSeparator(index: number): boolean {
  if (index === 0) return true;
  const prev = messages.value[index - 1];
  const curr = messages.value[index];
  if (!prev || !curr) return false;
  return prev.timestamp.toDateString() !== curr.timestamp.toDateString();
}

function formatDateSeparator(date: Date): string {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === now.toDateString())
    return t("Time Yesterday") === "昨天" ? "今天" : "Today";
  if (date.toDateString() === yesterday.toDateString()) return t("Time Yesterday");
  return date.toLocaleDateString();
}
</script>

<template>
  <div class="flex-1 overflow-hidden relative">
    <!-- 空状态 -->
    <div v-if="!hasMessages" class="absolute inset-0 flex flex-col items-center justify-center">
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
    <div v-else ref="scrollContainer" class="h-full overflow-y-auto px-6 py-4 space-y-4">
      <template v-for="(msg, i) in messages" :key="msg.id">
        <!-- 日期分隔 -->
        <div v-if="shouldShowDateSeparator(i)" class="flex justify-center">
          <span class="text-xs text-muted bg-elevated px-3 py-1 rounded-full border border-default">
            {{ formatDateSeparator(msg.timestamp) }}
          </span>
        </div>

        <!-- 用户消息 -->
        <div v-if="msg.role === 'user'" class="flex justify-end">
          <div class="flex items-start gap-3 max-w-[75%] flex-row-reverse">
            <div
              class="size-9 rounded-full bg-primary/15 flex items-center justify-center shrink-0"
            >
              <UIcon name="i-lucide-user" class="size-4 text-primary" />
            </div>
            <div>
              <div class="rounded-2xl rounded-tr-md bg-primary/10 px-4 py-2.5 text-sm text-default">
                {{ msg.content }}
              </div>
              <p class="text-xs text-muted mt-1 text-right">{{ formatTime(msg.timestamp) }}</p>
            </div>
          </div>
        </div>

        <!-- 助手消息 -->
        <div v-else class="flex justify-start">
          <div class="flex items-start gap-3 max-w-[75%]">
            <div class="size-9 rounded-full bg-info/15 flex items-center justify-center shrink-0">
              <UIcon name="i-lucide-bot" class="size-4 text-info" />
            </div>
            <div>
              <div
                class="rounded-2xl rounded-tl-md bg-elevated border border-default px-4 py-2.5 text-sm text-default"
              >
                {{ msg.content }}
              </div>
              <p class="text-xs text-muted mt-1">{{ formatTime(msg.timestamp) }}</p>
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
