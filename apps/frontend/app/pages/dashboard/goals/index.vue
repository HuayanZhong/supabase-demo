<script setup lang="ts">
const { t } = useI18n();
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">{{ t("Goal Space") }}</h1>
        <p class="text-sm text-toned mt-1">{{ t("Goal SpaceDesc") }}</p>
      </div>
      <UButton color="primary" icon="i-lucide-plus">
        {{ t("Goal New") }}
      </UButton>
    </div>

    <!-- 项目网格 + 工时分布 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- 项目网格：2 列 -->
      <div class="lg:col-span-2">
        <BusinessGoalsGoalListCard />
      </div>

      <!-- 右侧栏：工时分布 -->
      <BusinessGoalsGoalTimeChart />
    </div>
  </div>
</template>
