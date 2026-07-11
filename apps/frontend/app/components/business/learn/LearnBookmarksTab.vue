<script setup lang="ts">
import type { Bookmark } from "@supabase/types";

const { t } = useI18n();
const { bookmarks } = useLearn();

const searchQueryRef = ref("");

const sourceConfig: Record<string, { icon: string; color: string; label: string }> = {
  external: {
    icon: "i-lucide-globe",
    color: "info",
    label: t("Learn BookmarkSourceExternal"),
  },
  github: {
    icon: "i-lucide-github",
    color: "neutral",
    label: t("Learn BookmarkSourceGithub"),
  },
  article: {
    icon: "i-lucide-file-text",
    color: "success",
    label: t("Learn BookmarkSourceArticle"),
  },
  video: {
    icon: "i-lucide-video",
    color: "error",
    label: t("Learn BookmarkSourceVideo"),
  },
  internal: {
    icon: "i-lucide-link",
    color: "primary",
    label: t("Learn BookmarkSourceInternal"),
  },
};

const filteredBookmarks = computed<Bookmark[]>(() => {
  if (!searchQueryRef.value.trim()) return bookmarks;
  const q = searchQueryRef.value.trim().toLowerCase();
  return bookmarks.filter(
    (b) =>
      b.title.toLowerCase().includes(q) ||
      b.description.toLowerCase().includes(q) ||
      b.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
});

function openLink(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}
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
          v-model="searchQueryRef"
          :placeholder="t('Learn BookmarkSearch')"
          class="w-full rounded-lg border border-default bg-elevated pl-9 pr-3 py-2 text-sm text-default outline-none focus:border-primary transition-colors placeholder:text-muted"
        />
      </div>
      <UButton :label="t('Learn BookmarkNew')" icon="i-lucide-plus" color="primary" size="sm" />
    </div>

    <!-- 收藏列表 -->
    <div v-if="filteredBookmarks.length" class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div
        v-for="bookmark in filteredBookmarks"
        :key="bookmark.id"
        class="rounded-xl border border-default bg-elevated p-4 space-y-3 hover:border-primary/50 transition-colors group cursor-pointer"
        @click="openLink(bookmark.url)"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <UIcon
                :name="sourceConfig[bookmark.source]!.icon"
                class="size-3.5 text-muted shrink-0"
              />
              <h4
                class="text-sm font-semibold text-highlighted truncate group-hover:text-primary transition-colors"
              >
                {{ bookmark.title }}
              </h4>
            </div>
            <p class="text-xs text-toned mt-1.5 line-clamp-2">
              {{ bookmark.description }}
            </p>
          </div>
          <UIcon
            name="i-lucide-external-link"
            class="size-4 text-muted opacity-0 group-hover:opacity-100 transition-opacity shrink-0 mt-0.5"
          />
        </div>

        <div class="flex items-center justify-between">
          <UBadge :color="sourceConfig[bookmark.source]!.color as any" variant="soft" size="xs">
            {{ sourceConfig[bookmark.source]!.label }}
          </UBadge>
          <div class="flex items-center gap-2">
            <template v-for="tag in bookmark.tags" :key="tag">
              <span class="text-xs text-muted">#{{ tag }}</span>
            </template>
            <span class="text-xs text-muted ml-1">{{ bookmark.savedAt }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-sm text-muted py-12 text-center">
      {{ t("Learn BookmarksNoContent") }}
    </div>
  </div>
</template>
