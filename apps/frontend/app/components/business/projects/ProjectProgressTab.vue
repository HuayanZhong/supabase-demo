<script setup lang="ts">
import type { Project, ProjectMilestone } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
}>();

const computedMilestones = computed(() => {
  const all = props.project.milestones;
  const done = all.filter((m) => m.status === "completed");
  const doing = all.filter((m) => m.status === "in_progress");
  const pending = all.filter((m) => m.status === "pending");
  const rate = all.length > 0 ? Math.round((done.length / all.length) * 100) : 0;
  return { all, done, doing, pending, rate };
});

const milestoneMeta: Record<
  ProjectMilestone["status"],
  { color: string; icon: string; label: string }
> = {
  pending: { color: "text-muted", icon: "i-lucide-circle", label: t("Project MilestonePending") },
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
  <div class="space-y-6">
    <!-- 里程碑进度概览 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <h3 class="text-base font-semibold text-highlighted mb-4">
        {{ t("Project MilestoneSummary") }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-check-circle-2" class="size-8 text-success shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project MilestoneCompleted") }}</p>
            <p class="text-xl font-bold text-highlighted">{{ computedMilestones.done.length }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-loader" class="size-8 text-info shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project MilestoneInProgress") }}</p>
            <p class="text-xl font-bold text-highlighted">{{ computedMilestones.doing.length }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-circle" class="size-8 text-muted shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project MilestonePending") }}</p>
            <p class="text-xl font-bold text-highlighted">
              {{ computedMilestones.pending.length }}
            </p>
          </div>
        </div>
      </div>
      <div>
        <div class="flex items-center justify-between mb-1.5">
          <span class="text-xs text-toned">{{ t("Project MilestoneProgress") }}</span>
          <span class="text-xs font-semibold text-highlighted">{{ computedMilestones.rate }}%</span>
        </div>
        <UProgress :model-value="computedMilestones.rate" color="primary" size="md" />
      </div>
    </div>

    <!-- 里程碑时间线 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-base font-semibold text-highlighted">
          {{ t("Project MilestoneTimeline") }}
        </h3>
        <span class="text-xs text-muted">{{
          t("Project TotalCount", { count: computedMilestones.all.length })
        }}</span>
      </div>

      <div v-if="computedMilestones.all.length === 0" class="text-sm text-muted text-center py-8">
        {{ t("Project NoMilestones") }}
      </div>

      <div v-else class="space-y-0">
        <div
          v-for="(milestone, idx) in computedMilestones.all"
          :key="milestone.id"
          class="relative flex items-start gap-4 pb-6 last:pb-0"
        >
          <div
            v-if="idx < computedMilestones.all.length - 1"
            class="absolute left-[17px] top-10 bottom-0 w-px bg-default"
          />
          <div
            class="flex items-center justify-center size-9 rounded-full bg-elevated shrink-0 z-10"
            :class="milestoneMeta[milestone.status].color"
          >
            <UIcon :name="milestoneMeta[milestone.status].icon" class="size-5" />
          </div>
          <div class="flex-1 min-w-0 pt-1">
            <div class="flex items-center gap-2 flex-wrap">
              <h4 class="text-sm font-semibold text-highlighted">{{ milestone.name }}</h4>
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
  </div>
</template>
