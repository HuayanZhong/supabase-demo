<script setup lang="ts">
const { t } = useI18n();

defineProps<{
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: string): void;
}>();

const tabs = [
  { id: "overview", label: t("Learn TabOverview"), icon: "i-lucide-layout-dashboard" },
  { id: "knowledge", label: t("Learn TabKnowledge"), icon: "i-lucide-library" },
  { id: "notes", label: t("Learn TabNotes"), icon: "i-lucide-pencil-line" },
  { id: "bookmarks", label: t("Learn TabBookmarks"), icon: "i-lucide-bookmark" },
  { id: "records", label: t("Learn TabRecords"), icon: "i-lucide-history" },
];
</script>

<template>
  <div class="space-y-5">
    <!-- 顶部：页面标题 -->
    <div class="flex items-center gap-3">
      <div class="flex items-center justify-center size-12 rounded-xl bg-elevated shrink-0">
        <UIcon name="i-lucide-brain" class="size-6 text-primary" />
      </div>
      <div>
        <h1 class="text-xl font-bold text-highlighted">{{ t("Learn Space") }}</h1>
        <p class="text-sm text-toned mt-0.5">{{ t("Learn SpaceDesc") }}</p>
      </div>
    </div>

    <!-- Tab 导航 -->
    <div class="flex items-center gap-1 border-b border-default pb-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors duration-150 border-b-2 -mb-px"
        :class="
          activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-muted hover:text-default hover:border-default'
        "
        @click="emit('update:activeTab', tab.id)"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>
  </div>
</template>
