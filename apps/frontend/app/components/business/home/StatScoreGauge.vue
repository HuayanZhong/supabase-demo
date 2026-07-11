<script setup lang="ts">
const { t } = useI18n();

// 评分数据（静态示例）
const score = 87;
const prevScore = 82;
const diff = score - prevScore;

// SVG 圆环参数
const size = 140;
const strokeWidth = 10;
const radius = (size - strokeWidth) / 2;
const circumference = 2 * Math.PI * radius;
const dashOffset = computed(() => circumference * (1 - score / 100));
</script>

<template>
  <div
    class="rounded-xl border border-default bg-default p-4 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default"
  >
    <!-- 头部：图标 + 趋势 -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <div class="flex items-center justify-center size-8 rounded-lg bg-info/10">
          <UIcon name="i-lucide-trending-up" class="size-4 text-info" />
        </div>
        <span class="text-sm font-semibold text-highlighted">{{ t("Stat GrowthScore") }}</span>
      </div>
      <div class="flex items-center gap-1 text-xs">
        <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-info" />
        <span class="font-semibold text-info">+{{ diff }}</span>
      </div>
    </div>

    <!-- SVG 圆环 + 中心文字 -->
    <div class="flex items-center justify-center gap-6">
      <div class="relative shrink-0">
        <svg :width="size" :height="size" class="-rotate-90">
          <!-- 渐变定义 -->
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stop-color="#60a5fa" />
              <stop offset="100%" stop-color="#3b82f6" />
            </linearGradient>
          </defs>
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
            stroke="url(#scoreGradient)"
            class="transition-all duration-700 ease-out"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="dashOffset"
          />
        </svg>
        <!-- 中心数字 -->
        <div class="absolute inset-0 flex flex-col items-center justify-center">
          <span class="text-2xl font-bold text-highlighted">{{ score }}</span>
        </div>
      </div>

      <!-- 右侧详情 -->
      <div class="space-y-2">
        <div>
          <p class="text-xs text-muted">{{ t("Trend ComparedLastWeek") }}</p>
          <p class="text-lg font-semibold text-success mt-0.5">
            +{{ diff }} {{ t("Trend Points") }}
          </p>
        </div>
        <div class="flex items-center gap-1.5 text-xs text-muted">
          <UIcon name="i-lucide-target" class="size-3.5" />
          <span>100 {{ t("Trend MaxScore") }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
