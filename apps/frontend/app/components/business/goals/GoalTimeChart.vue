<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

const { t } = useI18n();
const { textColor, mutedColor, isDark } = useChartTheme();

const timeRange = ref<"7d" | "30d" | "90d">("7d");
const timeRangeOptions = [
  { value: "7d" as const, label: t("TimeRange 7d") },
  { value: "30d" as const, label: t("TimeRange 30d") },
  { value: "90d" as const, label: t("TimeRange 90d") },
];

const timeRangeData = {
  "7d": [35, 25, 20, 15, 5],
  "30d": [140, 90, 75, 55, 20],
  "90d": [420, 280, 210, 150, 60],
};

const totalHours = computed(() => timeRangeData[timeRange.value].reduce((a, b) => a + b, 0));

const dimLabels = computed(() => [
  t("Goal Dim Code"),
  t("Goal Dim Design"),
  t("Goal Dim Test"),
  t("Goal Dim Docs"),
  t("Goal Dim Meeting"),
]);
// 需要响应主题变化，所以用 computed
const dimColors = computed(() => [
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  isDark.value ? "#a1a1aa" : "#18181b",
]);

const chartOption = computed(() => ({
  tooltip: { confine: true },
  legend: {
    bottom: 0,
    itemWidth: 10,
    itemHeight: 10,
    textStyle: { color: mutedColor.value, fontSize: 11 },
  },
  series: [
    {
      type: "pie",
      radius: ["20%", "70%"],
      center: ["50%", "45%"],
      roseType: "area",
      label: {
        show: true,
        formatter: "{b}\n{d}%",
        fontSize: 10,
        color: textColor.value,
      },
      labelLine: { length: 12, length2: 8 },
      itemStyle: {
        borderRadius: 6,
        borderColor: isDark.value ? "#18181b" : "#ffffff",
        borderWidth: 2,
      },
      data: dimLabels.value.map((name, i) => ({
        value: timeRangeData[timeRange.value][i],
        name,
        itemStyle: { color: dimColors.value[i] },
      })),
    },
  ],
}));
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden flex flex-col">
    <!-- 头部：标题 + 时间筛选 -->
    <div class="flex items-center justify-between px-5 pt-5 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
          <UIcon name="i-lucide-pie-chart" class="size-4 text-primary" />
        </div>
        <span class="font-semibold text-highlighted">{{ t("Goal Dim Title") }}</span>
      </div>
      <!-- 时间范围筛选 -->
      <div class="flex items-center bg-elevated rounded-lg p-0.5">
        <button
          v-for="opt in timeRangeOptions"
          :key="opt.value"
          class="px-3 py-1.5 text-xs rounded-md transition-colors duration-150"
          :class="
            timeRange === opt.value
              ? 'bg-default text-highlighted shadow-sm font-medium'
              : 'text-muted hover:text-default'
          "
          @click="timeRange = opt.value"
        >
          {{ opt.label }}
        </button>
      </div>
    </div>

    <!-- 图表：min-h 确保图表有最小展示空间，同时允许随容器扩展 -->
    <div class="flex-1 px-3 pb-3 min-h-[320px]">
      <ClientOnly>
        <VChart
          :option="chartOption"
          autoresize
          :init-options="{ renderer: 'svg' }"
          style="width: 100%; height: 100%"
        />
      </ClientOnly>
    </div>

    <!-- 总工时统计 -->
    <div class="px-5 pb-4 pt-3 border-t border-default">
      <div class="flex items-center justify-between mb-3">
        <span class="text-xs text-muted">{{ t("Goal Dim TotalHours") }}</span>
        <span class="text-lg font-bold text-highlighted">{{ totalHours }}h</span>
      </div>
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-trending-up" class="size-4 text-success" />
        <span class="text-xs text-toned">{{ t("Insight GrowthSummary") }}</span>
      </div>
    </div>
  </div>
</template>
