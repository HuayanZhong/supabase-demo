<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { GaugeChart } from "echarts/charts";
import VChart from "vue-echarts";

use([CanvasRenderer, GaugeChart]);

const { t } = useI18n();
const { textColor, trackColor } = useChartTheme();

// 今日计划任务数据（静态示例）
const tasks = [{ done: true }, { done: true }, { done: true }, { done: false }, { done: false }];

// 完成进度百分比
const progress = computed(() =>
  Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100),
);

// 环形进度图配置
const chartOption = computed(() => ({
  series: [
    {
      type: "gauge",
      radius: "100%",
      startAngle: 90,
      endAngle: -270,
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: { color: "#22c55e" },
      },
      axisLine: { lineStyle: { width: 12, color: [[1, trackColor.value]] } },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      detail: {
        valueAnimation: true,
        fontSize: 20,
        fontWeight: "bold",
        color: textColor.value,
        formatter: "{value}%",
        offsetCenter: [0, "0%"],
      },
      title: { show: false },
      data: [{ value: progress.value }],
    },
  ],
}));
</script>

<template>
  <div
    class="rounded-xl border border-default bg-default p-4 overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-default flex flex-col"
  >
    <!-- 头部：图标 + 完成数 -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center justify-center size-10 rounded-xl bg-success/10">
        <UIcon name="i-lucide-check-square" class="size-5 text-success" />
      </div>
      <span class="text-xs text-muted font-medium"
        >{{ tasks.filter((task) => task.done).length }}/{{ tasks.length }}
        {{ t("Trend Completed") }}</span
      >
    </div>

    <!-- 图表：居中大圆环 -->
    <div class="flex-1 flex items-center justify-center min-h-[100px]">
      <div class="w-full h-full max-w-[140px] max-h-[140px]">
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
    <p class="text-center text-sm font-semibold text-highlighted mt-2">
      {{ t("Stat TodayTasks") }}
    </p>
    <p class="text-center text-xs text-muted mt-0.5">{{ t("Trend ThisWeek") }} +15%</p>
  </div>
</template>
