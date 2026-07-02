<script setup lang="ts">
import type { Project, DocumentType } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
}>();

const docMeta: Record<DocumentType, { icon: string; label: string; color: string }> = {
  doc: { icon: "i-lucide-file-text", label: t("Project DocDoc"), color: "text-info" },
  sheet: { icon: "i-lucide-table", label: t("Project DocSheet"), color: "text-success" },
  figma: { icon: "i-lucide-pen-tool", label: t("Project DocFigma"), color: "text-warning" },
  markdown: { icon: "i-lucide-file-code", label: t("Project DocMarkdown"), color: "text-primary" },
};

const docStats = computed(() => {
  const all = props.project.documents;
  const byType = all.reduce(
    (acc, doc) => {
      acc[doc.type] = (acc[doc.type] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return { all, byType };
});
</script>

<template>
  <div class="space-y-6">
    <!-- 文档概览 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-highlighted">{{ t("Project DocOverview") }}</h3>
        <UButton color="primary" icon="i-lucide-plus" size="sm">
          {{ t("Goal New") }}
        </UButton>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          v-for="[type, meta] of Object.entries(docMeta)"
          :key="type"
          class="flex items-center gap-3 p-3 rounded-lg bg-elevated"
        >
          <UIcon :name="meta.icon" class="size-6" :class="meta.color" />
          <div>
            <p class="text-xs text-toned">{{ meta.label }}</p>
            <p class="text-lg font-bold text-highlighted">{{ docStats.byType[type] ?? 0 }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 文档列表 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-highlighted">{{ t("Project DocAll") }}</h3>
        <span class="text-xs text-muted">{{
          t("Project TotalCount", { count: docStats.all.length })
        }}</span>
      </div>

      <div v-if="docStats.all.length === 0" class="text-sm text-muted text-center py-8">
        {{ t("Project NoDocuments") }}
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div
          v-for="doc in docStats.all"
          :key="doc.id"
          class="flex items-center gap-3 p-4 rounded-lg border border-default hover:bg-elevated transition-colors duration-150 cursor-pointer"
        >
          <div class="flex items-center justify-center size-10 rounded-lg bg-elevated shrink-0">
            <UIcon :name="docMeta[doc.type].icon" class="size-5" :class="docMeta[doc.type].color" />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-default truncate">{{ doc.name }}</p>
            <p class="text-xs text-muted mt-0.5">
              {{ docMeta[doc.type].label }} ·
              {{ t("Project DocumentUpdated", { name: doc.updatedBy, time: doc.updatedAt }) }}
            </p>
          </div>
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-lucide-download"
            size="sm"
            class="shrink-0"
          />
        </div>
      </div>
    </div>
  </div>
</template>
