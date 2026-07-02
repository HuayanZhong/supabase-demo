<script setup lang="ts">
import type { Project } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
  activeTab: string;
}>();

const emit = defineEmits<{
  (e: "update:activeTab", tab: string): void;
  (e: "switchProject", id: string): void;
}>();

const { projects, healthMeta } = useProjects();

const tabs = [
  { id: "overview", label: t("Project TabOverview"), icon: "i-lucide-layout-dashboard" },
  { id: "progress", label: t("Project TabProgress"), icon: "i-lucide-trending-up" },
  { id: "tasks", label: t("Project TabTasks"), icon: "i-lucide-check-square" },
  { id: "documents", label: t("Project TabDocuments"), icon: "i-lucide-file-text" },
  { id: "ai", label: t("Project TabAI"), icon: "i-lucide-sparkles" },
  { id: "settings", label: t("Project TabSettings"), icon: "i-lucide-settings" },
];
</script>

<template>
  <div class="space-y-5">
    <!-- 顶部：项目信息 + 切换下拉 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center size-12 rounded-xl bg-elevated shrink-0">
          <UIcon :name="project.icon" class="size-6 text-primary" />
        </div>
        <div>
          <div class="flex items-center gap-2">
            <h1 class="text-xl font-bold text-highlighted">{{ project.name }}</h1>
            <UBadge
              :color="project.status === 'active' ? 'success' : 'neutral'"
              variant="soft"
              size="sm"
            >
              {{ project.status === "active" ? t("Project Running") : t("Goal Status Archived") }}
            </UBadge>
          </div>
          <p class="text-sm text-toned mt-0.5">{{ project.description }}</p>
        </div>
      </div>

      <!-- 项目切换下拉 -->
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted shrink-0">{{ t("Project Switch") }}:</span>
        <select
          class="rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-default outline-none focus:border-primary transition-colors cursor-pointer appearance-none min-w-[140px]"
          :value="project.id"
          @change="(e: Event) => emit('switchProject', (e.target as HTMLSelectElement).value)"
        >
          <option v-for="p in projects" :key="p.id" :value="p.id">
            {{ p.name }}
          </option>
        </select>
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
