<script setup lang="ts">
const { t, locale } = useI18n();

const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 6) return t("Greeting Night");
  if (hour < 12) return t("Greeting Morning");
  if (hour < 18) return t("Greeting Afternoon");
  return t("Greeting Evening");
});

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
  <div class="space-y-4">
    <div>
      <h1 class="text-2xl font-bold text-highlighted">{{ greeting }}</h1>
      <p class="text-sm text-toned mt-1">{{ today }}</p>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div class="relative overflow-hidden">
        <div
          class="pointer-events-none absolute -top-6 -right-6 size-20 bg-linear-to-bl from-elevated to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatGoalChart />
      </div>
      <div class="relative overflow-hidden">
        <div
          class="pointer-events-none absolute -bottom-6 -left-6 size-20 bg-linear-to-tr from-elevated to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatTaskGauge />
      </div>
      <div class="relative overflow-hidden">
        <div
          class="pointer-events-none absolute -top-6 -right-6 size-20 bg-linear-to-bl from-elevated to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatStreakBar />
      </div>
      <div class="relative overflow-hidden">
        <div
          class="pointer-events-none absolute -bottom-6 -left-6 size-20 bg-linear-to-tr from-elevated to-transparent rounded-full blur-2xl"
          aria-hidden="true"
        />
        <BusinessHomeStatScoreGauge />
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-3">
      <BusinessHomeTodayPlanCard />
      <div class="relative overflow-hidden">
        <div
          class="absolute -top-8 -right-8 size-32 bg-linear-to-bl from-elevated to-transparent rounded-full blur-2xl pointer-events-none"
          aria-hidden="true"
        />
        <div
          class="absolute -bottom-6 -left-6 size-14 text-(--ui-bg-elevated) pointer-events-none"
          aria-hidden="true"
        >
          <UIcon name="i-lucide-sparkles" class="size-full" />
        </div>
        <BusinessHomeGrowthRadarCard />
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      <BusinessHomeWorkspaceCard />
      <BusinessHomeRecentChatsCard />
      <BusinessHomeCalendarWeatherCard />
    </div>

    <BusinessHomeRecentFilesCard />
  </div>
</template>
