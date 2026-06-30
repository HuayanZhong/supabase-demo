<script setup lang="ts">
const { t } = useI18n();

// 视图切换：网格 / 看板
const viewMode = ref<"grid" | "kanban">("grid");
const viewOptions = [
  { value: "grid" as const, icon: "i-lucide-layout-grid" },
  { value: "kanban" as const, icon: "i-lucide-columns-3" },
];
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">{{ t("Goal Space") }}</h1>
        <p class="text-sm text-toned mt-1">{{ t("Goal SpaceDesc") }}</p>
      </div>
      <div class="flex items-center gap-3">
        <!-- 视图切换 -->
        <div class="flex items-center bg-elevated rounded-lg p-0.5">
          <button
            v-for="opt in viewOptions"
            :key="opt.value"
            class="p-2 rounded-md transition-colors duration-150"
            :class="
              viewMode === opt.value
                ? 'bg-default text-highlighted shadow-sm'
                : 'text-muted hover:text-default'
            "
            @click="viewMode = opt.value"
          >
            <UIcon :name="opt.icon" class="size-4" />
          </button>
        </div>
        <UButton color="primary" icon="i-lucide-plus">
          {{ t("Goal New") }}
        </UButton>
      </div>
    </div>

    <!-- 网格视图 -->
    <template v-if="viewMode === 'grid'">
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
        <!-- 左侧：目标列表 -->
        <div class="lg:col-span-3">
          <BusinessGoalsGoalListCard />
        </div>

        <!-- 右侧栏：每日打卡 -->
        <BusinessGoalsGoalDailyCheckin />
      </div>
    </template>

    <!-- 看板视图 -->
    <template v-else>
      <div class="space-y-5">
        <!-- 每日打卡 -->
        <div class="grid grid-cols-1 lg:grid-cols-4 gap-5">
          <div class="lg:col-span-3">
            <BusinessGoalsGoalKanbanCard />
          </div>
          <BusinessGoalsGoalDailyCheckin />
        </div>

        <!-- 工时分布 -->
        <BusinessGoalsGoalTimeChart />
      </div>
    </template>
  </div>
</template>
