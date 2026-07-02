<script setup lang="ts">
import type { KnowledgeCategory, KnowledgeItem } from "@supabase/types";

const { t } = useI18n();
const { knowledgeItems, categoryMeta } = useLearn();

// 当前筛选分类
const selectedCategory = ref<KnowledgeCategory | "all">("all");
// 搜索关键词
const searchQuery = ref("");

// 状态配置
const statusConfig: Record<string, { color: string; label: string }> = {
  draft: { color: "warning", label: t("Learn KnowledgeStatusDraft") },
  published: { color: "success", label: t("Learn KnowledgeStatusPublished") },
  archived: { color: "neutral", label: t("Learn KnowledgeStatusArchived") },
};

// 过滤条目
const filteredItems = computed<KnowledgeItem[]>(() => {
  let items = knowledgeItems;
  if (selectedCategory.value !== "all") {
    items = items.filter((k) => k.category === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    items = items.filter(
      (k) =>
        k.title.toLowerCase().includes(q) ||
        k.summary.toLowerCase().includes(q) ||
        k.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  return items;
});
</script>

<template>
  <div class="space-y-5">
    <!-- 工具栏 -->
    <div class="flex items-center gap-3">
      <div class="relative flex-1 max-w-sm">
        <UIcon
          name="i-lucide-search"
          class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted"
        />
        <input
          v-model="searchQuery"
          :placeholder="t('Learn KnowledgeSearch')"
          class="w-full rounded-lg border border-default bg-elevated pl-9 pr-3 py-2 text-sm text-default outline-none focus:border-primary transition-colors placeholder:text-muted"
        />
      </div>
      <select
        v-model="selectedCategory"
        class="rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-default outline-none focus:border-primary transition-colors cursor-pointer"
      >
        <option value="all">{{ t("Learn KnowledgeFilterCategory") }}</option>
        <option v-for="(meta, key) in categoryMeta" :key="key" :value="key">
          {{ meta.label }}
        </option>
      </select>
      <UButton :label="t('Learn KnowledgeNew')" icon="i-lucide-plus" color="primary" size="sm" />
    </div>

    <!-- 条目列表 -->
    <div v-if="filteredItems.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="item in filteredItems"
        :key="item.id"
        class="rounded-xl border border-default bg-elevated p-4 space-y-3 hover:border-primary/50 transition-colors"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h4 class="text-sm font-semibold text-highlighted truncate">
                {{ item.title }}
              </h4>
              <UBadge :color="statusConfig[item.status]!.color as any" variant="soft" size="xs">
                {{ statusConfig[item.status]!.label }}
              </UBadge>
            </div>
            <p class="text-xs text-toned mt-1.5 line-clamp-2">
              {{ item.summary }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <!-- 分类 + 标签 -->
          <div class="flex items-center gap-2 flex-wrap min-w-0">
            <UBadge :color="categoryMeta[item.category]!.color" variant="soft" size="xs">
              <UIcon :name="categoryMeta[item.category]!.icon" class="size-3" />
              {{ categoryMeta[item.category]!.label }}
            </UBadge>
            <template v-for="tag in item.tags" :key="tag">
              <span class="text-xs text-muted">{{ tag }}</span>
            </template>
          </div>

          <!-- 元信息 -->
          <div class="flex items-center gap-3 text-xs text-muted shrink-0">
            <span class="flex items-center gap-1">
              <UIcon name="i-lucide-eye" class="size-3" />
              {{ item.viewCount }}
            </span>
            <span>{{ item.updatedAt }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-sm text-muted py-12 text-center">
      {{ t("Learn KnowledgeNoItems") }}
    </div>
  </div>
</template>
