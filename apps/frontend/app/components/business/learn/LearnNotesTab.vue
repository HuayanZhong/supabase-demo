<script setup lang="ts">
import type { KnowledgeCategory, Note } from "@supabase/types";

const { t } = useI18n();
const { notes, categoryMeta } = useLearn();

// 当前筛选分类
const selectedCategory = ref<KnowledgeCategory | "all">("all");
// 搜索关键词
const searchQuery = ref("");

// 过滤笔记
const filteredNotes = computed<Note[]>(() => {
  let items = notes;
  if (selectedCategory.value !== "all") {
    items = items.filter((n) => n.category === selectedCategory.value);
  }
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.trim().toLowerCase();
    items = items.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some((tag) => tag.toLowerCase().includes(q)),
    );
  }
  // 置顶优先，然后按更新日期倒序
  return [...items].toSorted((a, b) => {
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
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
          :placeholder="t('Learn NoteSearch')"
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
      <UButton :label="t('Learn NoteNew')" icon="i-lucide-plus" color="primary" size="sm" />
    </div>

    <!-- 笔记列表 -->
    <div v-if="filteredNotes.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="note in filteredNotes"
        :key="note.id"
        class="rounded-xl border border-default bg-elevated p-4 space-y-3 hover:border-primary/50 transition-colors"
        :class="{ 'ring-1 ring-primary/20': note.isPinned }"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <UIcon
                v-if="note.isPinned"
                name="i-lucide-pin"
                class="size-3.5 text-warning shrink-0"
              />
              <h4 class="text-sm font-semibold text-highlighted truncate">
                {{ note.title }}
              </h4>
            </div>
            <p class="text-xs text-toned mt-2 line-clamp-3 leading-relaxed">
              {{ note.content }}
            </p>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <UBadge :color="categoryMeta[note.category]!.color" variant="soft" size="xs">
            <UIcon :name="categoryMeta[note.category]!.icon" class="size-3" />
            {{ categoryMeta[note.category]!.label }}
          </UBadge>
          <div class="flex items-center gap-2 text-xs text-muted">
            <template v-for="tag in note.tags" :key="tag">
              <span>#{{ tag }}</span>
            </template>
            <span class="text-xs text-muted ml-2">{{ note.updatedAt }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-sm text-muted py-12 text-center">
      {{ t("Learn NotesNoContent") }}
    </div>
  </div>
</template>
