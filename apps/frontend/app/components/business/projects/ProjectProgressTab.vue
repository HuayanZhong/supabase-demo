<script setup lang="ts">
import type { Project } from "@supabase/types";
import type { ProjectMilestone } from "@supabase/types";

const { t } = useI18n();

defineProps<{
  project: Project;
}>();

const milestoneMeta: Record<
  ProjectMilestone["status"],
  { color: string; icon: string; label: string }
> = {
  pending: {
    color: "text-muted",
    icon: "i-lucide-circle",
    label: t("Project MilestonePending"),
  },
  in_progress: {
    color: "text-info",
    icon: "i-lucide-loader",
    label: t("Project MilestoneInProgress"),
  },
  completed: {
    color: "text-success",
    icon: "i-lucide-check-circle-2",
    label: t("Project MilestoneCompleted"),
  },
};
</script>

<template>
  <div class="rounded-xl border border-default bg-default p-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-base font-semibold text-highlighted">
        {{ t("Project Milestones") }}
      </h3>
    </div>

    <div v-if="project.milestones.length === 0" class="text-sm text-muted text-center py-8">
      {{ t("Project NoMilestones") }}
    </div>

    <!-- 里程碑时间线 -->
    <div v-else class="space-y-0">
      <div
        v-for="(milestone, idx) in project.milestones"
        :key="milestone.id"
        class="relative flex items-start gap-4 pb-6 last:pb-0"
      >
        <!-- 时间线竖线 -->
        <div
          v-if="idx < project.milestones.length - 1"
          class="absolute left-[17px] top-10 bottom-0 w-px bg-default"
        />
        <!-- 状态图标 -->
        <div
          class="flex items-center justify-center size-9 rounded-full bg-elevated shrink-0 z-10"
          :class="milestoneMeta[milestone.status].color"
        >
          <UIcon :name="milestoneMeta[milestone.status].icon" class="size-5" />
        </div>
        <!-- 内容 -->
        <div class="flex-1 min-w-0 pt-1">
          <div class="flex items-center gap-2">
            <h4 class="text-sm font-semibold text-highlighted">
              {{ milestone.name }}
            </h4>
            <UBadge
              :color="
                milestone.status === 'completed'
                  ? 'success'
                  : milestone.status === 'in_progress'
                    ? 'info'
                    : 'neutral'
              "
              variant="soft"
              size="sm"
            >
              {{ milestoneMeta[milestone.status].label }}
            </UBadge>
          </div>
          <p class="text-sm text-toned mt-1">{{ milestone.description }}</p>
          <p class="text-xs text-muted mt-1">
            <UIcon name="i-lucide-calendar" class="size-3.5 inline mr-1" />
            {{ t("Project Deadline") }}: {{ milestone.deadline }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
