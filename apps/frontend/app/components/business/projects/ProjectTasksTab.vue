<script setup lang="ts">
import type { Project, ProjectTask, TaskPriority, TaskStatus } from "@supabase/types";

const { t } = useI18n();

defineProps<{
  project: Project;
}>();

const priorityMeta: Record<
  TaskPriority,
  { color: "error" | "warning" | "neutral"; label: string }
> = {
  high: { color: "error", label: t("Project PriorityHigh") },
  medium: { color: "warning", label: t("Project PriorityMedium") },
  low: { color: "neutral", label: t("Project PriorityLow") },
};

const statusMeta: Record<TaskStatus, { color: "neutral" | "info" | "success"; label: string }> = {
  todo: { color: "neutral", label: t("Project TaskTodo") },
  doing: { color: "info", label: t("Project TaskDoing") },
  done: { color: "success", label: t("Project TaskDone") },
};

const statusIcon: Record<TaskStatus, string> = {
  todo: "i-lucide-circle",
  doing: "i-lucide-loader",
  done: "i-lucide-check-circle-2",
};
</script>

<template>
  <div class="rounded-xl border border-default bg-default p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-highlighted">{{ t("Project Tasks") }}</h3>
      <UButton color="primary" icon="i-lucide-plus" size="sm">
        {{ t("Goal New") }}
      </UButton>
    </div>

    <div v-if="project.taskList.length === 0" class="text-sm text-muted text-center py-8">
      {{ t("Project NoTasks") }}
    </div>

    <div v-else class="space-y-2">
      <div
        v-for="task in project.taskList"
        :key="task.id"
        class="flex items-center gap-3 p-3 rounded-lg hover:bg-elevated transition-colors duration-150"
      >
        <!-- 状态图标 -->
        <button class="shrink-0" :class="statusMeta[task.status].color">
          <UIcon :name="statusIcon[task.status]" class="size-5" />
        </button>
        <!-- 任务名称 -->
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium"
            :class="task.status === 'done' ? 'text-muted line-through' : 'text-default'"
          >
            {{ task.name }}
          </p>
          <p class="text-xs text-muted mt-0.5">
            {{ t("Project Assignee") }}: {{ task.assignee }} · {{ t("Project Deadline") }}:
            {{ task.deadline }}
          </p>
        </div>
        <!-- 优先级 -->
        <UBadge :color="priorityMeta[task.priority].color" variant="soft" size="sm">
          {{ priorityMeta[task.priority].label }}
        </UBadge>
      </div>
    </div>
  </div>
</template>
