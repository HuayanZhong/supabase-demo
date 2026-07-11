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
  <div class="relative space-y-4">
    <!-- 全局背景装饰：多层渐变光晕 -->
    <div class="pointer-events-none fixed inset-0 overflow-hidden -z-10" aria-hidden="true">
      <div
        class="absolute -top-40 -left-40 size-[500px] rounded-full bg-linear-to-br from-primary/6 via-primary/3 to-transparent blur-3xl"
      />
      <div
        class="absolute -bottom-40 -right-40 size-[450px] rounded-full bg-gradient-to-tl from-info/6 via-info/3 to-transparent blur-3xl"
      />
      <div
        class="absolute top-1/3 left-2/3 size-[350px] rounded-full bg-gradient-to-bl from-warning/4 to-transparent blur-3xl"
      />
    </div>

    <!-- 页面头部：问候语 + 日期 -->
    <div>
      <h1 class="text-2xl font-bold text-highlighted">{{ greeting }}</h1>
      <p class="text-sm text-toned mt-1">{{ today }}</p>
    </div>

    <!-- 统计卡片：每张卡片附带颜色匹配的装饰光晕 -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="relative">
        <div
          class="pointer-events-none absolute -top-6 -right-6 size-20 bg-gradient-to-bl from-primary/10 to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatGoalChart />
      </div>
      <div class="relative">
        <div
          class="pointer-events-none absolute -bottom-6 -left-6 size-20 bg-gradient-to-tr from-success/10 to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatTaskGauge />
      </div>
      <div class="relative">
        <div
          class="pointer-events-none absolute -top-6 -right-6 size-20 bg-gradient-to-bl from-warning/10 to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatStreakBar />
      </div>
      <div class="relative">
        <div
          class="pointer-events-none absolute -bottom-6 -left-6 size-20 bg-gradient-to-tr from-info/10 to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatScoreGauge />
      </div>
    </div>

    <!-- 中间区域：今日计划 + 成长雷达 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <BusinessHomeTodayPlanCard />
      <div class="relative">
        <div
          class="absolute -top-8 -right-8 size-32 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          class="absolute -bottom-6 -left-6 size-14 text-primary/5 pointer-events-none"
          aria-hidden="true"
        >
          <UIcon name="i-lucide-sparkles" class="size-full" />
        </div>
        <BusinessHomeGrowthRadarCard />
      </div>
    </div>

    <!-- 工作空间 + 最近对话 + 日历/天气 -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <BusinessHomeWorkspaceCard />
      <BusinessHomeRecentChatsCard />
      <BusinessHomeCalendarWeatherCard />
    </div>

    <!-- 最近文件 -->
    <BusinessHomeRecentFilesCard />
  </div>
</template>
