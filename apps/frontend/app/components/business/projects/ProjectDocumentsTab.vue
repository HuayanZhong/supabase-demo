<script setup lang="ts">
import type { Project, DocumentType } from "@supabase/types";

const { t } = useI18n();

defineProps<{
  project: Project;
}>();

const docMeta: Record<DocumentType, { icon: string; label: string; color: string }> = {
  doc: { icon: "i-lucide-file-text", label: t("Project DocDoc"), color: "text-info" },
  sheet: { icon: "i-lucide-table", label: t("Project DocSheet"), color: "text-success" },
  figma: { icon: "i-lucide-pen-tool", label: t("Project DocFigma"), color: "text-warning" },
  markdown: { icon: "i-lucide-file-code", label: t("Project DocMarkdown"), color: "text-primary" },
};
</script>

<template>
  <div class="rounded-xl border border-default bg-default p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-highlighted">{{ t("Project Documents") }}</h3>
      <UButton color="primary" icon="i-lucide-plus" size="sm">
        {{ t("Goal New") }}
      </UButton>
    </div>

    <div v-if="project.documents.length === 0" class="text-sm text-muted text-center py-8">
      {{ t("Project NoDocuments") }}
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="doc in project.documents"
        :key="doc.id"
        class="flex items-center gap-3 p-3 rounded-lg hover:bg-elevated transition-colors duration-150 cursor-pointer"
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
        <UButton color="neutral" variant="ghost" icon="i-lucide-download" size="sm" />
      </div>
    </div>
  </div>
</template>
