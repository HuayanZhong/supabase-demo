<script setup lang="ts">
const { t } = useI18n();

const tasks = [{ done: true }, { done: true }, { done: true }, { done: false }, { done: false }];

const progress = computed(() =>
  Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100),
);

const size = 180;
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const dashOffset = computed(() => circumference * (1 - progress.value / 100));
</script>

<template>
  <div
    class="rounded-xl border border-default bg-default p-4 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
  >
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="flex items-center justify-center size-8 rounded-lg bg-success/10">
          <UIcon name="i-lucide-check-square" class="size-4 text-success" />
        </div>
        <span class="text-sm font-semibold text-highlighted">{{ t("Stat TodayTasks") }}</span>
      </div>
      <span class="text-xs text-muted">{{ t("Trend ThisWeek") }} +15%</span>
    </div>

    <div class="flex items-center justify-center gap-6">
      <div class="relative shrink-0">
        <svg :width="size" :height="size" class="-rotate-90">
          <!-- 背景轨道 -->
          <circle
            :cx.attr="String(size / 2)"
            :cy.attr="String(size / 2)"
            :r.attr="String(radius)"
            fill="none"
            :stroke-width="strokeWidth"
            class="stroke-muted/20"
          />
          <!-- 进度弧 -->
          <circle
            :cx.attr="String(size / 2)"
            :cy.attr="String(size / 2)"
            :r.attr="String(radius)"
            fill="none"
            :stroke-width="strokeWidth"
            stroke-linecap="round"
            class="stroke-success transition-all duration-700 ease-out"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <!-- 中心数字 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-highlighted">{{ progress }}%</span>
        </div>
      </div>

      <!-- 右侧详情 -->
      <div class="space-y-2">
        <div>
          <p class="text-2xl font-bold text-highlighted">
            {{ tasks.filter((task) => task.done).length }}/{{ tasks.length }}
          </p>
          <p class="text-xs text-muted">{{ t("Trend Completed") }}</p>
        </div>
        <UProgress :model-value="progress" color="success" size="sm" />
      </div>
    </div>
  </div>
</template>
