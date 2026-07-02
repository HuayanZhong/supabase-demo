<script setup lang="ts">
import type { Project, TaskPriority, TaskStatus } from "@supabase/types";

const { t } = useI18n();

const props = defineProps<{
  project: Project;
}>();

const taskStats = computed(() => {
  const all = props.project.taskList;
  const done = all.filter((task) => task.status === "done");
  const doing = all.filter((task) => task.status === "doing");
  const todo = all.filter((task) => task.status === "todo");
  return { all, done, doing, todo };
});

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
  <div class="space-y-6">
    <!-- 任务概览 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-highlighted">
          {{ t("Project TaskOverview") }}
        </h3>
        <UButton color="primary" icon="i-lucide-plus" size="sm">
          {{ t("Goal New") }}
        </UButton>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-list-todo" class="size-8 text-muted shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project TaskTodo") }}</p>
            <p class="text-xl font-bold text-highlighted">
              {{ taskStats.todo.length }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-loader" class="size-8 text-info shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project TaskDoing") }}</p>
            <p class="text-xl font-bold text-highlighted">
              {{ taskStats.doing.length }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-check-circle-2" class="size-8 text-success shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project TaskDone") }}</p>
            <p class="text-xl font-bold text-highlighted">
              {{ taskStats.done.length }}
            </p>
          </div>
        </div>
      </div>

      <UProgress
        :model-value="
          project.tasks.total > 0 ? Math.round((project.tasks.done / project.tasks.total) * 100) : 0
        "
        color="primary"
        size="md"
        class="mt-4"
      />
      <p class="text-xs text-muted mt-1.5 text-right">
        {{
          t("Project CompletionRate", {
            rate:
              project.tasks.total > 0
                ? Math.round((project.tasks.done / project.tasks.total) * 100)
                : 0,
          })
        }}
      </p>
    </div>

    <!-- 任务列表 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-base font-semibold text-highlighted">
          {{ t("Project TaskList") }}
        </h3>
        <span class="text-xs text-muted">{{
          t("Project TotalCount", { count: taskStats.all.length })
        }}</span>
      </div>

      <div v-if="taskStats.all.length === 0" class="text-sm text-muted text-center py-8">
        {{ t("Project NoTasks") }}
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-3">
        <div
          v-for="task in taskStats.all"
          :key="task.id"
          class="flex items-center gap-3 p-4 rounded-lg border border-default hover:bg-elevated transition-colors duration-150"
        >
          <button class="shrink-0" :class="statusMeta[task.status].color">
            <UIcon :name="statusIcon[task.status]" class="size-5" />
          </button>
          <div class="flex-1 min-w-0">
            <p
              class="text-sm font-medium"
              :class="task.status === 'done' ? 'text-muted line-through' : 'text-default'"
            >
              {{ task.name }}
            </p>
            <p class="text-xs text-muted mt-0.5 flex items-center gap-2">
              <span>{{ t("Project Assignee") }}: {{ task.assignee }}</span>
              <span>·</span>
              <span>{{ t("Project Deadline") }}: {{ task.deadline }}</span>
            </p>
          </div>
          <UBadge
            :color="priorityMeta[task.priority].color"
            variant="soft"
            size="sm"
            class="shrink-0"
          >
            {{ priorityMeta[task.priority].label }}
          </UBadge>
        </div>
      </div>
    </div>
  </div>
</template>
