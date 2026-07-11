<script setup lang="ts">
// 今日计划卡片
const { t } = useI18n();

const tasks = [
  {
    id: 1,
    title: t("Task ReadDesignPatterns"),
    category: t("Category Learning"),
    categoryColor: "primary" as const,
    time: "09:00 - 10:30",
    done: true,
  },
  {
    id: 2,
    title: t("Task CompleteApiModule"),
    category: t("Category Work"),
    categoryColor: "info" as const,
    time: "10:30 - 12:00",
    done: true,
  },
  {
    id: 3,
    title: t("Task WriteTechBlog"),
    category: t("Category Creation"),
    categoryColor: "warning" as const,
    time: "14:00 - 15:30",
    done: true,
  },
  {
    id: 4,
    title: t("Task ReviewCode"),
    category: t("Category Work"),
    categoryColor: "info" as const,
    time: "15:30 - 16:30",
    done: false,
  },
  {
    id: 5,
    title: t("Task Exercise"),
    category: t("Category Health"),
    categoryColor: "success" as const,
    time: "17:00 - 18:00",
    done: false,
  },
];

const progress = computed(() =>
  Math.round((tasks.filter((task) => task.done).length / tasks.length) * 100),
);
</script>

<template>
  <div class="lg:col-span-2 rounded-xl border border-default bg-default overflow-hidden">
    <div class="flex items-center justify-between px-5 pt-5 pb-4">
      <div class="flex items-center gap-2.5">
        <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
          <UIcon name="i-lucide-calendar-check" class="size-4 text-primary" />
        </div>
        <span class="font-semibold text-highlighted">{{ t("TodayPlan") }}</span>
      </div>
      <div class="flex items-center gap-2">
        <UProgress :model-value="progress" color="success" size="xs" class="w-16" />
        <span class="text-xs text-muted font-medium"
          >{{ tasks.filter((task) => task.done).length }}/{{ tasks.length }}</span
        >
      </div>
    </div>

    <div class="px-5 pb-5 space-y-2">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="flex items-center gap-3 p-3 rounded-lg transition-colors duration-150"
        :class="task.done ? 'bg-elevated/40' : 'bg-elevated'"
      >
        <div class="flex flex-col items-center shrink-0">
          <div
            class="size-2.5 rounded-full ring-2 ring-default"
            :class="task.done ? 'bg-success' : 'bg-muted'"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium truncate transition-colors duration-150"
            :class="task.done ? 'text-muted line-through decoration-1' : 'text-default'"
          >
            {{ task.title }}
          </p>
          <div class="flex items-center gap-2 mt-1">
            <span class="inline-flex items-center gap-1 text-xs text-muted">
              <span
                class="inline-block size-1.5 rounded-full shrink-0"
                :class="{
                  'bg-primary': task.categoryColor === 'primary',
                  'bg-info': task.categoryColor === 'info',
                  'bg-warning': task.categoryColor === 'warning',
                  'bg-success': task.categoryColor === 'success',
                }"
              />
              {{ task.category }}
            </span>
            <span class="text-xs text-muted/50">·</span>
            <span class="text-xs text-muted">{{ task.time }}</span>
          </div>
        </div>
        <UIcon v-if="task.done" name="i-lucide-circle-check" class="size-4 text-success shrink-0" />
        <UIcon v-else name="i-lucide-circle" class="size-4 text-muted/40 shrink-0" />
      </div>
    </div>

    <div class="px-5 pb-5">
      <div class="flex items-center gap-2.5">
        <UProgress :model-value="progress" color="success" size="sm" class="flex-1" />
        <span class="text-xs font-medium text-muted shrink-0">{{ progress }}%</span>
      </div>
    </div>
  </div>
</template>
