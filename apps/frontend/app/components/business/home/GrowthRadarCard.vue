<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart } from "echarts/charts";
import { TooltipComponent, RadarComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, RadarChart, TooltipComponent, RadarComponent]);

const { t } = useI18n();
const { mutedColor, gridColor, radarAreaColor, radarLineColor, radarBorderColor } = useChartTheme();

// 雷达图配置
const chartOption = computed(() => ({
  tooltip: { confine: true },
  radar: {
    shape: "circle",
    radius: "65%",
    center: ["50%", "52%"],
    indicator: [
      { name: t("Radar Focus"), max: 100 },
      { name: t("Radar Reading"), max: 100 },
      { name: t("Radar Skills"), max: 100 },
      { name: t("Radar Exercise"), max: 100 },
      { name: t("Radar Efficiency"), max: 100 },
    ],
    splitNumber: 4,
    axisName: { color: mutedColor.value, fontSize: 11 },
    splitLine: { lineStyle: { color: gridColor.value } },
    splitArea: { show: false },
    axisLine: { lineStyle: { color: gridColor.value } },
  },
  series: [
    {
      type: "radar",
      symbol: "circle",
      symbolSize: 6,
      lineStyle: { width: 2, color: radarLineColor.value },
      areaStyle: { color: radarAreaColor.value },
      itemStyle: {
        color: radarLineColor.value,
        borderColor: radarBorderColor.value,
        borderWidth: 2,
      },
      data: [
        {
          value: [75, 40, 60, 80, 70],
          name: t("GrowthInsight"),
        },
      ],
    },
  ],
}));
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden flex flex-col">
    <!-- 头部：图标 + 标题 -->
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-3">
      <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10">
        <UIcon name="i-lucide-sparkles" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("GrowthInsight") }}</span>
    </div>

    <!-- 雷达图：填充整个卡片高度 -->
    <div class="flex-1 px-3 pb-4 min-h-[260px]">
      <ClientOnly>
        <VChart :option="chartOption" autoresize style="width: 100%; height: 100%" />
      </ClientOnly>
    </div>
  </div>
</template>
