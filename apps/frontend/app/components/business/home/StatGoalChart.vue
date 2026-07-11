<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, LineChart, TooltipComponent, GridComponent]);

const { t } = useI18n();
const { textColor, areaColorStart, areaColorEnd } = useChartTheme();

// 迷你折线面积图配置
const chartOption = computed(() => ({
  tooltip: { trigger: "axis", confine: true },
  grid: { left: 4, right: 4, top: 8, bottom: 4 },
  xAxis: {
    type: "category",
    show: false,
    data: ["一月", "二月", "三月", "四月", "五月", "六月"],
  },
  yAxis: { type: "value", show: false, min: 0 },
  series: [
    {
      type: "line",
      data: [1, 2, 2, 3, 3, 5],
      smooth: true,
      showSymbol: false,
      lineStyle: { width: 2, color: textColor.value },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: areaColorStart.value },
            { offset: 1, color: areaColorEnd.value },
          ],
        },
      },
    },
  ],
}));
</script>

<template>
  <div
    class="rounded-xl border border-default bg-default p-4 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default flex flex-col"
  >
    <!-- 头部：图标 + 趋势 -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10">
        <UIcon name="i-lucide-target" class="size-5 text-primary" />
      </div>
      <div class="flex items-center gap-1 text-xs">
        <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-primary" />
        <span class="font-semibold text-primary">+2</span>
      </div>
    </div>

    <!-- 数值 -->
    <p class="text-3xl font-bold text-highlighted tracking-tight">5</p>
    <p class="text-sm text-toned mt-0.5">{{ t("Stat ActiveGoals") }}</p>

    <!-- 图表：固定高度，确保图表有足够空间展示 -->
    <div class="h-[130px] mt-3 -mx-1">
      <ClientOnly>
        <VChart
          :option="chartOption"
          autoresize
          :init-options="{ renderer: 'svg' }"
          style="width: 100%; height: 100%"
        />
      </ClientOnly>
    </div>
  </div>
</template>
