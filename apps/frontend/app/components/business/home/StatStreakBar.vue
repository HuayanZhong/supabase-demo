<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, BarChart, TooltipComponent, GridComponent]);

const { t } = useI18n();

// 竖向柱状图配置（本周每日成长记录）
const chartOption = computed(() => ({
  tooltip: { trigger: "axis", confine: true },
  grid: { left: 4, right: 4, top: 4, bottom: 4 },
  xAxis: {
    type: "category",
    show: false,
    data: ["一", "二", "三", "四", "五", "六", "日"],
  },
  yAxis: { type: "value", show: false, min: 0 },
  series: [
    {
      type: "bar",
      data: [4, 5, 3, 5, 4, 6, 5],
      barWidth: "50%",
      itemStyle: {
        borderRadius: [3, 3, 0, 0],
        color: "#f59e0b",
      },
    },
  ],
}));
</script>

<template>
  <div
    class="rounded-xl border border-default bg-default p-4 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default flex flex-col"
  >
    <!-- 头部：图标 + 天数 -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center justify-center size-10 rounded-xl bg-warning/10">
        <UIcon name="i-lucide-flame" class="size-5 text-warning" />
      </div>
      <span class="text-xs text-muted font-medium">23 {{ t("Trend Days") }}</span>
    </div>

    <!-- 数值 -->
    <p class="text-3xl font-bold text-highlighted tracking-tight">23</p>
    <p class="text-sm text-toned mt-0.5">{{ t("Stat Streak") }}</p>

    <!-- 图表：固定高度，确保柱状图清晰可见 -->
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
