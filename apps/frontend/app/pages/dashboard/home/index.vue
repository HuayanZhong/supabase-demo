<script setup lang="ts">
const { t, locale } = useI18n();

// 当前时间问候语
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return t("Greeting Night");
  if (hour < 12) return t("Greeting Morning");
  if (hour < 18) return t("Greeting Afternoon");
  return t("Greeting Evening");
});

// 本地化日期
const today = computed(() =>
  new Date().toLocaleDateString(locale.value, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "long",
  }),
);
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部：问候语 + 日期 -->
    <div>
      <h1 class="text-2xl font-bold text-highlighted">{{ greeting }}</h1>
      <p class="text-sm text-toned mt-1">{{ today }}</p>
    </div>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <BusinessHomeStatGoalChart />
      <BusinessHomeStatTaskGauge />
      <BusinessHomeStatStreakBar />
      <BusinessHomeStatScoreGauge />
    </div>

    <!-- 中部区域：今日计划 + 成长雷达 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <BusinessHomeTodayPlanCard />
      <BusinessHomeGrowthRadarCard />
    </div>

    <!-- 工作空间 + 最近对话 + 日历/天气 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <BusinessHomeWorkspaceCard />
      <BusinessHomeRecentChatsCard />
      <BusinessHomeCalendarWeatherCard />
    </div>

    <!-- 最近文件 -->
    <BusinessHomeRecentFilesCard />
  </div>
</template>
