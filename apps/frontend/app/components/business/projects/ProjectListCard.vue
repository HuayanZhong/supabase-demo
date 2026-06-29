<script setup lang="ts">
const { t } = useI18n();

// 项目数据
const projects = [
  {
    name: t("Project GrowthOs"),
    description: t("Project GrowthOsDesc"),
    status: "active" as const,
    progress: 68,
    members: 3,
    tasks: { done: 12, total: 18 },
    updated: t("Time HoursAgo", { n: 2 }),
    tags: [t("Tag Frontend"), t("Tag Nuxt")],
    icon: "i-lucide-sprout",
    color: "success" as const,
  },
  {
    name: t("Project DesignSystem"),
    description: t("Project DesignSystemDesc"),
    status: "active" as const,
    progress: 45,
    members: 2,
    tasks: { done: 9, total: 20 },
    updated: t("Time HoursAgo", { n: 5 }),
    tags: [t("Tag Design"), t("Tag Figma")],
    icon: "i-lucide-palette",
    color: "info" as const,
  },
  {
    name: t("Project ApiPlatform"),
    description: t("Project ApiPlatformDesc"),
    status: "active" as const,
    progress: 82,
    members: 4,
    tasks: { done: 33, total: 40 },
    updated: t("Time Yesterday"),
    tags: [t("Tag Backend"), t("Tag Supabase")],
    icon: "i-lucide-server",
    color: "warning" as const,
  },
  {
    name: t("Project MobileApp"),
    description: t("Project MobileAppDesc"),
    status: "archived" as const,
    progress: 100,
    members: 2,
    tasks: { done: 24, total: 24 },
    updated: "2025-06-15",
    tags: [t("Tag Mobile"), t("Tag Flutter")],
    icon: "i-lucide-smartphone",
    color: "primary" as const,
  },
  {
    name: t("Project DataAnalytics"),
    description: t("Project DataAnalyticsDesc"),
    status: "archived" as const,
    progress: 100,
    members: 1,
    tasks: { done: 15, total: 15 },
    updated: "2025-05-20",
    tags: [t("Tag Data"), t("Tag Python")],
    icon: "i-lucide-bar-chart-3",
    color: "warning" as const,
  },
];

type ProjectColor = "success" | "info" | "warning" | "primary";

// 颜色映射
const colorClass: Record<ProjectColor, { bg: string; text: string }> = {
  success: { bg: "bg-success/10", text: "text-success" },
  info: { bg: "bg-info/10", text: "text-info" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
  primary: { bg: "bg-primary/10", text: "text-primary" },
};

const statusLabel = (status: "active" | "archived") =>
  status === "active" ? t("Project Status Active") : t("Project Status Archived");
</script>

<template>
  <!-- 项目网格：2 列，统一卡片样式 -->
  <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
    <div
      v-for="project in projects"
      :key="project.name"
      class="rounded-xl border border-default bg-default overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col"
      :class="{ 'opacity-70': project.status === 'archived' }"
    >
      <!-- 头部：带颜色背景 -->
      <div class="p-5 pb-4" :class="colorClass[project.color].bg">
        <div class="flex items-center gap-3">
          <div class="flex items-center justify-center size-11 rounded-xl bg-default/60 shrink-0">
            <UIcon :name="project.icon" class="size-5.5" :class="colorClass[project.color].text" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="text-base font-semibold text-highlighted truncate">{{ project.name }}</h3>
              <UBadge
                :color="project.status === 'active' ? 'success' : 'neutral'"
                variant="soft"
                size="sm"
              >
                {{ statusLabel(project.status) }}
              </UBadge>
            </div>
          </div>
        </div>
        <p class="text-sm text-toned mt-3 line-clamp-2">{{ project.description }}</p>
      </div>

      <!-- 内容区 -->
      <div class="p-5 pt-3 flex-1 flex flex-col justify-between bg-default">
        <!-- 标签 -->
        <div class="flex items-center gap-1.5 flex-wrap">
          <UBadge
            v-for="tag in project.tags"
            :key="tag"
            color="neutral"
            variant="outline"
            size="sm"
          >
            {{ tag }}
          </UBadge>
        </div>

        <!-- 进度条 -->
        <div class="mt-4 flex items-center gap-2.5">
          <UProgress
            :model-value="project.progress"
            :color="project.status === 'active' ? project.color : 'neutral'"
            size="sm"
            class="flex-1"
          />
          <span class="text-sm font-medium text-muted shrink-0">{{ project.progress }}%</span>
        </div>

        <!-- 底部信息 -->
        <div
          class="flex items-center justify-between mt-4 pt-4 border-t border-default text-xs text-muted"
        >
          <div class="flex items-center gap-4">
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-users" class="size-4" />
              {{ project.members }} {{ t("Members") }}
            </span>
            <span class="flex items-center gap-1.5">
              <UIcon name="i-lucide-check-square" class="size-4" />
              {{ project.tasks.done }}/{{ project.tasks.total }}
            </span>
          </div>
          <span class="flex items-center gap-1.5">
            <UIcon name="i-lucide-clock" class="size-4" />
            {{ project.updated }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
