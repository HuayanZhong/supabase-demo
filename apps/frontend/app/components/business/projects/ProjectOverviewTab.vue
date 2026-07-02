<script setup lang="ts">
import type { Project } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
}>();

const { healthMeta } = useProjects();

const health = healthMeta[props.project.health];
const completionRate = computed(() =>
  props.project.tasks.total > 0
    ? Math.round((props.project.tasks.done / props.project.tasks.total) * 100)
    : 0,
);

/** 活动图标映射 */
function activityIcon(type: string): string {
  const map: Record<string, string> = {
    task_completed: "i-lucide-check-circle-2",
    comment_added: "i-lucide-message-square",
    file_uploaded: "i-lucide-upload",
    task_created: "i-lucide-plus-circle",
    milestone_reached: "i-lucide-trophy",
  };
  return map[type] ?? "i-lucide-circle";
}
</script>

<template>
  <div class="space-y-6">
    <!-- 健康度卡片 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-start justify-between">
        <div>
          <h3 class="text-base font-semibold text-highlighted">{{ t("Project Health") }}</h3>
          <p class="text-sm text-toned mt-1">{{ t("Project HealthDesc") }}</p>
        </div>
        <UBadge :color="health.color" variant="solid" size="md">
          {{ health.label }}
        </UBadge>
      </div>

      <!-- 健康指标网格 -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6">
        <div class="flex items-center gap-3 p-3 rounded-lg bg-elevated">
          <div class="flex items-center justify-center size-10 rounded-lg bg-success/10 shrink-0">
            <UIcon name="i-lucide-trending-up" class="size-5 text-success" />
          </div>
          <div>
            <p class="text-xs text-toned">{{ t("Project ProgressTitle") }}</p>
            <p class="text-lg font-bold text-highlighted">
              {{ t("Project ProgressPercent", { progress: project.progress }) }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-elevated">
          <div class="flex items-center justify-center size-10 rounded-lg bg-info/10 shrink-0">
            <UIcon name="i-lucide-users" class="size-5 text-info" />
          </div>
          <div>
            <p class="text-xs text-toned">{{ t("Project Members") }}</p>
            <p class="text-lg font-bold text-highlighted">{{ project.members }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-3 rounded-lg bg-elevated">
          <div
            class="flex items-center justify-center size-10 rounded-lg shrink-0"
            :class="completionRate >= 80 ? 'bg-success/10' : 'bg-warning/10'"
          >
            <UIcon
              :name="completionRate >= 80 ? 'i-lucide-check-circle-2' : 'i-lucide-clock'"
              class="size-5"
              :class="completionRate >= 80 ? 'text-success' : 'text-warning'"
            />
          </div>
          <div>
            <p class="text-xs text-toned">{{ t("Project TaskCompletion") }}</p>
            <p class="text-lg font-bold text-highlighted">
              {{ t("Project CompletionRate", { rate: completionRate }) }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- 近期动态 -->
      <div class="rounded-xl border border-default bg-default p-6">
        <h3 class="text-base font-semibold text-highlighted mb-4">
          {{ t("Project RecentActivity") }}
        </h3>
        <div
          v-if="project.recentActivities.length === 0"
          class="text-sm text-muted text-center py-8"
        >
          {{ t("Project NoActivity") }}
        </div>
        <div v-else class="space-y-0">
          <div
            v-for="(activity, idx) in project.recentActivities"
            :key="activity.id"
            class="relative flex items-start gap-3 pb-4"
            :class="{ 'opacity-60': idx > 3 }"
          >
            <!-- 时间线竖线 -->
            <div
              v-if="idx < project.recentActivities.length - 1 && idx < 4"
              class="absolute left-[15px] top-8 bottom-0 w-px bg-default"
            />
            <div
              class="flex items-center justify-center size-8 rounded-full bg-elevated shrink-0 z-10"
            >
              <UIcon :name="activityIcon(activity.type)" class="size-4 text-toned" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-default">
                <span class="font-medium">{{ activity.user }}</span>
                <span class="text-toned"> {{ activity.content }}</span>
              </p>
              <p class="text-xs text-muted mt-0.5">{{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 任务完成率 -->
      <div class="rounded-xl border border-default bg-default p-6">
        <h3 class="text-base font-semibold text-highlighted mb-4">{{ t("Project TaskRate") }}</h3>
        <div class="flex flex-col items-center justify-center py-4">
          <!-- 环形进度 -->
          <div class="relative size-32">
            <svg class="size-32 -rotate-90" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                class="text-elevated"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="currentColor"
                stroke-width="8"
                stroke-linecap="round"
                :stroke-dasharray="`${completionRate * 3.39} 339.3`"
                :class="
                  completionRate >= 80
                    ? 'text-success'
                    : completionRate >= 50
                      ? 'text-warning'
                      : 'text-error'
                "
              />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-2xl font-bold text-highlighted">{{ completionRate }}%</span>
            </div>
          </div>
          <p class="text-sm text-toned mt-3">
            {{
              t("Project TaskRateDesc", { done: project.tasks.done, total: project.tasks.total })
            }}
          </p>
          <!-- 进度条 -->
          <UProgress
            :model-value="project.progress"
            color="primary"
            size="sm"
            class="w-full mt-4"
          />
          <p class="text-xs text-muted mt-1.5 w-full text-right">
            {{ t("Project ProgressTitle") }}: {{ project.progress }}%
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
