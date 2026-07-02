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
      text: t("Project AiProgressText", {
        progress: p.progress,
        status: p.progress >= 80 ? "进展顺利" : "需加快进度",
      }),
      detail: `${p.progress}% / 100%`,
      trend: p.progress >= 80 ? "+12%" : "+5%",
    },
    {
      title: t("Project AiRiskAnalysis"),
      icon: "i-lucide-alert-triangle",
      color: "text-warning",
      bg: "bg-warning/10",
      text: t("Project AiRiskText", { count: highRisk, area: p.tags[0] ?? "核心" }),
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
</script>

<template>
  <div class="rounded-xl border border-default bg-default p-6">
    <div class="flex items-center gap-3 mb-6">
      <div class="flex items-center justify-center size-10 rounded-xl bg-primary/10">
        <UIcon name="i-lucide-sparkles" class="size-5 text-primary" />
      </div>
      <div>
        <h3 class="text-base font-semibold text-highlighted">{{ t("Project AiTitle") }}</h3>
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
          <h4 class="text-sm font-semibold text-highlighted">{{ insight.title }}</h4>
        </div>
        <p class="text-sm text-toned leading-relaxed flex-1">{{ insight.text }}</p>

        <!-- 底部数据 -->
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-default">
          <span class="text-xs text-muted">{{ insight.detail }}</span>
          <span class="text-xs font-semibold" :class="insight.color">{{ insight.trend }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
