<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import VChart from "vue-echarts";

use([CanvasRenderer, GaugeChart]);

const { t } = useI18n();
const { textColor, trackColor } = useChartTheme();

// 仪表盘配置
const chartOption = computed(() => ({
  series: [
    {
      type: "gauge",
      radius: "100%",
      startAngle: 210,
      endAngle: -30,
      min: 0,
      max: 100,
      pointer: { show: true, length: "60%", width: 4, itemStyle: { color: "#3b82f6" } },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        width: 10,
        itemStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: "#60a5fa" },
              { offset: 1, color: "#3b82f6" },
            ],
          },
        },
      },
      axisLine: { lineStyle: { width: 10, color: [[1, trackColor.value]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        fontSize: 24,
        fontWeight: "bold",
        color: textColor.value,
        offsetCenter: [0, "35%"],
      },
      title: { show: false },
      data: [{ value: 87 }],
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
      <div class="flex items-center justify-center size-10 rounded-xl bg-info/10">
        <UIcon name="i-lucide-trending-up" class="size-5 text-info" />
      </div>
      <div class="flex items-center gap-1 text-xs">
        <UIcon name="i-lucide-arrow-up-right" class="size-3.5 text-info" />
        <span class="font-semibold text-info">+5</span>
      </div>
    </div>

    <!-- 图表：居中仪表盘 -->
    <div class="flex-1 flex items-center justify-center min-h-[120px]">
      <div class="w-full h-full max-w-[160px] max-h-[160px]">
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

    <!-- 标签 -->
    <p class="text-center text-sm text-toned mt-1">
      {{ t("Stat GrowthScore") }} · {{ t("Trend ComparedLastWeek") }}
    </p>
  </div>
</template>
