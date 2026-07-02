<script setup lang="ts">
import type { Project } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
}>();

// AI 洞察数据：基于项目状态推导
const insights = computed(() => {
  const p = props.project;
  const statusText = p.progress >= 80 ? "进展顺利" : "需加快进度";

  return [
    {
      title: t("Project AiProgressAnalysis"),
      icon: "i-lucide-trending-up",
      color: "text-info",
      bg: "bg-info/10",
      text: t("Project AiProgressText", {
        progress: p.progress,
        status: statusText,
      }),
    },
    {
      title: t("Project AiRiskAnalysis"),
      icon: "i-lucide-alert-triangle",
      color: "text-warning",
      bg: "bg-warning/10",
      text: t("Project AiRiskText", {
        count: p.taskList.filter((task) => task.priority === "high" && task.status !== "done")
          .length,
        area: p.tags[0] ?? "核心",
      }),
    },
    {
      title: t("Project AiSuggestTitle"),
      icon: "i-lucide-lightbulb",
      color: "text-success",
      bg: "bg-success/10",
      text: t("Project AiSuggestText", { percent: 27 }),
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
        class="rounded-lg border border-default p-4 hover:shadow-sm transition-shadow duration-150"
      >
        <div
          class="flex items-center justify-center size-9 rounded-lg shrink-0 mb-3"
          :class="insight.bg"
        >
          <UIcon :name="insight.icon" class="size-5" :class="insight.color" />
        </div>
        <h4 class="text-sm font-semibold text-highlighted mb-2">{{ insight.title }}</h4>
        <p class="text-sm text-toned leading-relaxed">{{ insight.text }}</p>
      </div>
    </div>
  </div>
</template>
