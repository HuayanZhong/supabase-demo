<script setup lang="ts">
import type { Project } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
}>();

const insights = computed(() => {
  const p = props.project;
  const highRisk = p.taskList.filter(
    (task) => task.priority === "high" && task.status !== "done",
  ).length;

  return [
    {
      title: t("Project AiProgressAnalysis"),
      icon: "i-lucide-trending-up",
      color: "text-info",
      bg: "bg-info/10",
      text:
        p.progress >= 80
          ? t("Project AiProgressOnTrack", { progress: p.progress })
          : t("Project AiProgressBehind", { progress: p.progress }),
      detail: `${p.progress}% / 100%`,
      trend: p.progress >= 80 ? "+12%" : "+5%",
    },
    {
      title: t("Project AiRiskAnalysis"),
      icon: "i-lucide-alert-triangle",
      color: "text-warning",
      bg: "bg-warning/10",
      text: t("Project AiRiskText", {
        count: highRisk,
        area: t("Project AiRiskAreaDefault"),
      }),
      detail: `${highRisk} ${t("Project AiIssues")}`,
      trend: highRisk > 0 ? t("Project AiNeedsAttention") : t("Project AiAllClear"),
    },
    {
      title: t("Project AiSuggestTitle"),
      icon: "i-lucide-lightbulb",
      color: "text-success",
      bg: "bg-success/10",
      text: t("Project AiSuggestText", { percent: 27 }),
      detail: t("Project AiOptimizationRate"),
      trend: "+27%",
    },
  ];
});

// 从高优先级未完成任务提取 AI 操作建议
const recommendations = computed(() => {
  const p = props.project;
  return p.taskList
    .filter((task) => task.priority === "high" && task.status !== "done")
    .slice(0, 4);
});

// 模拟 AI 近期分析记录
const recentAnalyses = computed(() => [
  {
    date: t("Project AiDateHoursAgo", { n: 2 }),
    content: t("Project AiAnalysisCodeQuality"),
    icon: "i-lucide-code",
    bg: "bg-info/10",
    color: "text-info",
  },
  {
    date: t("Project AiDateHoursAgo", { n: 6 }),
    content: t("Project AiAnalysisProgress"),
    icon: "i-lucide-bar-chart-3",
    bg: "bg-warning/10",
    color: "text-warning",
  },
  {
    date: t("Project AiDateDaysAgo", { n: 1 }),
    content: t("Project AiAnalysisTask"),
    icon: "i-lucide-list-checks",
    bg: "bg-success/10",
    color: "text-success",
  },
  {
    date: t("Project AiDateDaysAgo", { n: 2 }),
    content: t("Project AiAnalysisSchedule"),
    icon: "i-lucide-calendar-clock",
    bg: "bg-muted/20",
    color: "text-muted",
  },
]);
</script>

<template>
  <div class="space-y-6">
    <!-- 第一部分：AI 洞察概览 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10">
          <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
        </div>
        <div>
          <h3 class="text-base font-semibold text-highlighted">
            {{ t("Project AiTitle") }}
          </h3>
          <p class="text-sm text-toned">{{ t("Project AiDesc") }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="insight in insights"
          :key="insight.title"
          class="rounded-lg border border-default p-4 hover:shadow-sm transition-shadow duration-150 flex flex-col"
        >
          <div class="flex items-center gap-3 mb-3">
            <div
              class="flex items-center justify-center size-9 rounded-lg shrink-0"
              :class="insight.bg"
            >
              <UIcon :name="insight.icon" class="size-5" :class="insight.color" />
            </div>
            <h4 class="text-sm font-semibold text-highlighted">
              {{ insight.title }}
            </h4>
          </div>
          <p class="text-sm text-toned leading-relaxed flex-1">
            {{ insight.text }}
          </p>
          <div class="flex items-center justify-between mt-4 pt-3 border-t border-default">
            <span class="text-xs text-muted">{{ insight.detail }}</span>
            <span class="text-xs font-semibold" :class="insight.color">{{ insight.trend }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 第二部分：操作建议 + 近期分析（双列布局） -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- AI 建议操作项 -->
      <div class="rounded-xl border border-default bg-default p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex items-center justify-center size-10 rounded-xl bg-warning/10">
            <UIcon name="i-lucide-list-todo" class="size-5 text-warning" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-highlighted">
              {{ t("Project AiRecommendations") }}
            </h3>
            <p class="text-sm text-toned">
              {{ t("Project AiRecommendationsDesc") }}
            </p>
          </div>
        </div>

        <div v-if="recommendations.length === 0" class="text-center py-8">
          <UIcon name="i-lucide-check-circle" class="size-10 text-success mx-auto mb-3" />
          <p class="text-sm text-toned">{{ t("Project AiNoCriticalTasks") }}</p>
        </div>

        <div v-else class="space-y-3">
          <div
            v-for="(task, i) in recommendations"
            :key="task.id"
            class="flex items-start gap-3 p-3 rounded-lg border border-default hover:bg-default/50 transition-colors"
          >
            <span
              class="flex items-center justify-center size-6 rounded bg-warning/10 text-xs font-bold text-warning shrink-0 mt-0.5"
              >{{ i + 1 }}</span
            >
            <div class="flex-1 min-w-0">
              <p class="text-sm text-highlighted truncate">{{ task.name }}</p>
              <div class="flex items-center gap-3 mt-1.5">
                <span class="text-xs text-muted">{{ task.assignee }}</span>
                <span class="text-xs text-muted">·</span>
                <span class="text-xs text-warning">{{ t("Project AiPriorityHigh") }}</span>
                <span class="text-xs text-muted">·</span>
                <span class="text-xs text-muted"
                  >{{ t("Project AiDeadline") }} {{ task.deadline }}</span
                >
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 近期 AI 分析记录 -->
      <div class="rounded-xl border border-default bg-default p-6">
        <div class="flex items-center gap-3 mb-4">
          <div class="flex items-center justify-center size-10 rounded-xl bg-info/10">
            <UIcon name="i-lucide-history" class="size-5 text-info" />
          </div>
          <div>
            <h3 class="text-base font-semibold text-highlighted">
              {{ t("Project AiRecentAnalysis") }}
            </h3>
            <p class="text-sm text-toned">
              {{ t("Project AiRecentAnalysisDesc") }}
            </p>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="(item, i) in recentAnalyses"
            :key="i"
            class="flex items-start gap-3 p-3 rounded-lg hover:bg-default/50 transition-colors"
          >
            <div
              class="flex items-center justify-center size-8 rounded-lg shrink-0"
              :class="item.bg"
            >
              <UIcon :name="item.icon" class="size-4" :class="item.color" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-highlighted">{{ item.content }}</p>
              <p class="text-xs text-muted mt-1">{{ item.date }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
