<script setup lang="ts">
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import { TooltipComponent, LegendComponent } from "echarts/components";
import VChart from "vue-echarts";

use([CanvasRenderer, PieChart, TooltipComponent, LegendComponent]);

const { t } = useI18n();
const { textColor, mutedColor, isDark } = useChartTheme();

// 时间范围筛选
const timeRange = ref<"7d" | "30d" | "90d">("7d");
const timeRangeOptions = [
  { value: "7d" as const, label: t("TimeRange 7d") },
  { value: "30d" as const, label: t("TimeRange 30d") },
  { value: "90d" as const, label: t("TimeRange 90d") },
];

// 不同时间范围的工时数据
const timeRangeData = {
  "7d": [35, 25, 20, 15, 5],
  "30d": [140, 90, 75, 55, 20],
  "90d": [420, 280, 210, 150, 60],
};

// 项目数据
const projects = [
  {
    name: t("Project GrowthOs"),
    description: t("Project GrowthOsDesc"),
    status: "active" as const,
    progress: 68,
    members: 3,
    tasks: { done: 12, total: 18 },
    updated: t("Time HoursAgo", { n: 2 }),
    tags: [t("Tag Frontend"), t("Tag Nuxt")],
    icon: "i-lucide-sprout",
    color: "success" as const,
  },
  {
    name: t("Project DesignSystem"),
    description: t("Project DesignSystemDesc"),
    status: "active" as const,
    progress: 45,
    members: 2,
    tasks: { done: 9, total: 20 },
    updated: t("Time HoursAgo", { n: 5 }),
    tags: [t("Tag Design"), t("Tag Figma")],
    icon: "i-lucide-palette",
    color: "info" as const,
  },
  {
    name: t("Project ApiPlatform"),
    description: t("Project ApiPlatformDesc"),
    status: "active" as const,
    progress: 82,
    members: 4,
    tasks: { done: 33, total: 40 },
    updated: t("Time Yesterday"),
    tags: [t("Tag Backend"), t("Tag Supabase")],
    icon: "i-lucide-server",
    color: "warning" as const,
  },
  {
    name: t("Project MobileApp"),
    description: t("Project MobileAppDesc"),
    status: "archived" as const,
    progress: 100,
    members: 2,
    tasks: { done: 24, total: 24 },
    updated: "2025-06-15",
    tags: [t("Tag Mobile"), t("Tag Flutter")],
    icon: "i-lucide-smartphone",
    color: "primary" as const,
  },
  {
    name: t("Project DataAnalytics"),
    description: t("Project DataAnalyticsDesc"),
    status: "archived" as const,
    progress: 100,
    members: 1,
    tasks: { done: 15, total: 15 },
    updated: "2025-05-20",
    tags: [t("Tag Data"), t("Tag Python")],
    icon: "i-lucide-bar-chart-3",
    color: "warning" as const,
  },
];

const statusLabel = (status: "active" | "archived") =>
  status === "active" ? t("Project Status Active") : t("Project Status Archived");

// 颜色映射
const colorClass: Record<ProjectColor, { bg: string; text: string }> = {
  success: { bg: "bg-success/10", text: "text-success" },
  info: { bg: "bg-info/10", text: "text-info" },
  warning: { bg: "bg-warning/10", text: "text-warning" },
  primary: { bg: "bg-primary/10", text: "text-primary" },
} as const;

type ProjectColor = "success" | "info" | "warning" | "primary";

// 项目维度分布：南丁格尔玫瑰图，数据随时间范围切换
const dimLabels = computed(() => [
  t("Project Dim Code"),
  t("Project Dim Design"),
  t("Project Dim Test"),
  t("Project Dim Docs"),
  t("Project Dim Meeting"),
]);
const dimColors = [
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#f59e0b",
  isDark.value ? "#a1a1aa" : "#18181b",
];

const insightChartOption = computed(() => ({
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
        itemStyle: { color: dimColors[i] },
      })),
    },
  ],
}));
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-highlighted">{{ t("Project Space") }}</h1>
        <p class="text-sm text-toned mt-1">{{ t("Project SpaceDesc") }}</p>
      </div>
      <UButton color="primary" icon="i-lucide-plus">
        {{ t("Project New") }}
      </UButton>
    </div>

    <!-- 项目网格 + 成长雷达 -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- 项目网格：2 列，统一卡片样式 -->
      <div class="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div
          v-for="project in projects"
          :key="project.name"
          class="rounded-xl border border-default bg-default overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col"
          :class="{ 'opacity-70': project.status === 'archived' }"
        >
          <!-- 头部：带颜色背景 -->
          <div class="p-5 pb-4" :class="colorClass[project.color].bg">
            <div class="flex items-center gap-3">
              <div
                class="flex items-center justify-center size-11 rounded-xl bg-default/60 shrink-0"
              >
                <UIcon
                  :name="project.icon"
                  class="size-5.5"
                  :class="colorClass[project.color].text"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2">
                  <h3 class="text-base font-semibold text-highlighted truncate">
                    {{ project.name }}
                  </h3>
                  <UBadge
                    :color="project.status === 'active' ? 'success' : 'neutral'"
                    variant="soft"
                    size="sm"
                  >
                    {{ statusLabel(project.status) }}
                  </UBadge>
                </div>
              </div>
            </div>
            <p class="text-sm text-toned mt-3 line-clamp-2">{{ project.description }}</p>
          </div>

          <!-- 内容区 -->
          <div class="p-5 pt-3 flex-1 flex flex-col justify-between bg-default">
            <!-- 标签 -->
            <div class="flex items-center gap-1.5 flex-wrap">
              <UBadge
                v-for="tag in project.tags"
                :key="tag"
                color="neutral"
                variant="outline"
                size="sm"
              >
                {{ tag }}
              </UBadge>
            </div>

            <!-- 进度条 -->
            <div class="mt-4 flex items-center gap-2.5">
              <UProgress
                :model-value="project.progress"
                :color="project.status === 'active' ? project.color : 'neutral'"
                size="sm"
                class="flex-1"
              />
              <span class="text-sm font-medium text-muted shrink-0">{{ project.progress }}%</span>
            </div>

            <!-- 底部信息 -->
            <div
              class="flex items-center justify-between mt-4 pt-4 border-t border-default text-xs text-muted"
            >
              <div class="flex items-center gap-4">
                <span class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-users" class="size-4" />
                  {{ project.members }} {{ t("Members") }}
                </span>
                <span class="flex items-center gap-1.5">
                  <UIcon name="i-lucide-check-square" class="size-4" />
                  {{ project.tasks.done }}/{{ project.tasks.total }}
                </span>
              </div>
              <span class="flex items-center gap-1.5">
                <UIcon name="i-lucide-clock" class="size-4" />
                {{ project.updated }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧栏：工时分布 -->
      <div class="rounded-xl border border-default bg-default overflow-hidden flex flex-col">
        <!-- 头部：标题 + 时间筛选 -->
        <div class="flex items-center justify-between px-5 pt-5 pb-4">
          <div class="flex items-center gap-2.5">
            <div class="flex items-center justify-center size-8 rounded-lg bg-primary/10">
              <UIcon name="i-lucide-pie-chart" class="size-4 text-primary" />
            </div>
            <span class="font-semibold text-highlighted">{{ t("Project Dim Title") }}</span>
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

        <!-- 图表：放大 -->
        <div class="flex-1 px-3 pb-3 min-h-[320px]">
          <ClientOnly>
            <VChart
              :option="insightChartOption"
              autoresize
              :init-options="{ renderer: 'svg' }"
              style="width: 100%; height: 100%"
            />
          </ClientOnly>
        </div>

        <!-- 总工时统计 -->
        <div class="px-5 pb-4 pt-3 border-t border-default">
          <div class="flex items-center justify-between mb-3">
            <span class="text-xs text-muted">{{ t("Project Dim TotalHours") }}</span>
            <span class="text-lg font-bold text-highlighted">
              {{ timeRangeData[timeRange].reduce((a, b) => a + b, 0) }}h
            </span>
          </div>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-trending-up" class="size-4 text-success" />
            <span class="text-xs text-toned">{{ t("Insight GrowthSummary") }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
