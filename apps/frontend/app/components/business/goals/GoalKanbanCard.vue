<script setup lang="ts">
const { t } = useI18n();

// 目标数据，按看板状态分组
const columns = computed(() => [
  {
    key: "todo",
    label: t("Kanban Todo"),
    icon: "i-lucide-circle",
    color: "neutral" as const,
    items: [
      {
        id: 5,
        name: t("Goal DataAnalytics"),
        icon: "i-lucide-bar-chart-3",
        tags: [t("Tag Data"), t("Tag Python")],
        due: "2025-08-01",
        progress: 0,
      },
    ],
  },
  {
    key: "doing",
    label: t("Kanban Doing"),
    icon: "i-lucide-loader",
    color: "primary" as const,
    items: [
      {
        id: 1,
        name: t("Goal GrowthOs"),
        icon: "i-lucide-sprout",
        tags: [t("Tag Frontend"), t("Tag Nuxt")],
        due: "2025-07-15",
        progress: 68,
      },
      {
        id: 2,
        name: t("Goal DesignSystem"),
        icon: "i-lucide-palette",
        tags: [t("Tag Design"), t("Tag Figma")],
        due: "2025-07-30",
        progress: 45,
      },
      {
        id: 3,
        name: t("Goal ApiPlatform"),
        icon: "i-lucide-server",
        tags: [t("Tag Backend"), t("Tag Supabase")],
        due: "2025-07-10",
        progress: 82,
      },
    ],
  },
  {
    key: "done",
    label: t("Kanban Done"),
    icon: "i-lucide-circle-check",
    color: "success" as const,
    items: [
      {
        id: 4,
        name: t("Goal MobileApp"),
        icon: "i-lucide-smartphone",
        tags: [t("Tag Mobile"), t("Tag Flutter")],
        due: "2025-06-15",
        progress: 100,
      },
    ],
  },
]);

// 列头颜色
const columnStyles: Record<string, string> = {
  todo: "border-t-neutral",
  doing: "border-t-primary",
  done: "border-t-success",
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    <div
      v-for="col in columns"
      :key="col.key"
      class="rounded-xl border border-default bg-default overflow-hidden flex flex-col"
    >
      <!-- 列头 -->
      <div class="flex items-center gap-2 px-4 pt-4 pb-3 border-t-2" :class="columnStyles[col.key]">
        <UIcon
          :name="col.icon"
          class="size-4"
          :class="
            col.color === 'primary'
              ? 'text-primary'
              : col.color === 'success'
                ? 'text-success'
                : 'text-muted'
          "
        />
        <span class="text-sm font-semibold text-highlighted">{{ col.label }}</span>
        <UBadge color="neutral" variant="soft" size="sm" class="ml-auto">
          {{ col.items.length }}
        </UBadge>
      </div>

      <!-- 卡片列表 -->
      <div class="px-3 pb-3 space-y-2 flex-1 min-h-[200px]">
        <div
          v-for="item in col.items"
          :key="item.id"
          class="rounded-lg border border-default bg-default p-3 transition-all duration-150 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
        >
          <!-- 卡片头部 -->
          <div class="flex items-center gap-2 mb-2">
            <div class="flex items-center justify-center size-7 rounded-md bg-primary/10 shrink-0">
              <UIcon :name="item.icon" class="size-3.5 text-primary" />
            </div>
            <h4 class="text-sm font-medium text-highlighted truncate">{{ item.name }}</h4>
          </div>

          <!-- 标签 -->
          <div class="flex items-center gap-1 mb-2.5">
            <UBadge v-for="tag in item.tags" :key="tag" color="neutral" variant="outline" size="xs">
              {{ tag }}
            </UBadge>
          </div>

          <!-- 进度条（仅进行中） -->
          <div v-if="col.key === 'doing'" class="mb-2.5">
            <div class="flex items-center gap-2">
              <UProgress :model-value="item.progress" color="primary" size="xs" class="flex-1" />
              <span class="text-[10px] text-muted shrink-0">{{ item.progress }}%</span>
            </div>
          </div>

          <!-- 底部：截止日期 -->
          <div class="flex items-center gap-1 text-[10px] text-muted">
            <UIcon name="i-lucide-calendar" class="size-3" />
            <span>{{ item.due }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
