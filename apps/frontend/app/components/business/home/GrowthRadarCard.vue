<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { RadarChart } from "echarts/charts";
import { TooltipComponent, RadarComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, RadarChart, TooltipComponent, RadarComponent]);

const { t } = useI18n();
const { textColor, mutedColor, gridColor, radarAreaColor, radarLineColor, radarBorderColor } =
  useChartTheme();

// 成长维度数据（静态示例）
const dimensions = [
  { key: "focus", label: t("Radar Focus"), value: 75, icon: "i-lucide-brain" },
  { key: "reading", label: t("Radar Reading"), value: 40, icon: "i-lucide-book-open" },
  { key: "skills", label: t("Radar Skills"), value: 60, icon: "i-lucide-puzzle" },
  { key: "exercise", label: t("Radar Exercise"), value: 80, icon: "i-lucide-heart" },
  { key: "efficiency", label: t("Radar Efficiency"), value: 70, icon: "i-lucide-zap" },
];

// 雷达图配置
const chartOption = computed(() => ({
  tooltip: { confine: true },
  radar: {
    shape: "circle",
    radius: "68%",
    center: ["50%", "50%"],
    indicator: dimensions.map((d) => ({ name: d.label, max: 100 })),
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
          value: dimensions.map((d) => d.value),
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
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-2">
      <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10">
        <UIcon name="i-lucide-sparkles" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("GrowthInsight") }}</span>
    </div>

    <!-- 雷达图 -->
    <div class="flex-1 px-3 min-h-[200px]">
      <ClientOnly>
        <VChart :option="chartOption" autoresize style="width: 100%; height: 100%" />
      </ClientOnly>
    </div>

    <!-- 底部维度详情：每个维度一行，图标 + 标签 + 进度条 -->
    <div class="px-5 pb-4 pt-1 space-y-2">
      <div v-for="dim in dimensions" :key="dim.key" class="flex items-center gap-2">
        <UIcon :name="dim.icon" class="size-3.5 text-muted shrink-0" />
        <span class="text-xs text-muted w-10 shrink-0">{{ dim.label }}</span>
        <UProgress :model-value="dim.value" size="xs" class="flex-1" />
        <span class="text-xs text-muted w-7 text-right shrink-0">{{ dim.value }}</span>
      </div>
    </div>
  </div>
</template>
