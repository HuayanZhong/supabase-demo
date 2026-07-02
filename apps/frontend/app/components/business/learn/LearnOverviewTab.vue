<script setup lang="ts">
const { t } = useI18n();
const { stats, recentActivities, categoryDistribution, weeklyTrend, categoryMeta } = useLearn();

// 获取动态图标
function activityIcon(type: string): string {
  const map: Record<string, string> = {
    knowledge_created: "i-lucide-file-plus",
    note_created: "i-lucide-pencil",
    bookmark_saved: "i-lucide-bookmark-plus",
    learning_completed: "i-lucide-check-circle",
  };
  return map[type] || "i-lucide-activity";
}

// 获取动态文案
function activityLabel(activity: { type: string; content: string }): string {
  const typeKey: Record<string, string> = {
    knowledge_created: "Learn ActivityKnowledgeCreated",
    note_created: "Learn ActivityNoteCreated",
    bookmark_saved: "Learn ActivityBookmarkSaved",
    learning_completed: "Learn ActivityLearningCompleted",
  };
  return t(typeKey[activity.type] || "", { name: activity.content });
}

// 本周学习趋势 - 计算最大分钟数用于比例
const maxMinutes = Math.max(...weeklyTrend.map((d) => d.minutes), 1);
</script>

<template>
  <div class="space-y-5">
    <!-- 统计卡片 -->
    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <div class="space-y-1 rounded-xl border border-default bg-elevated p-4">
        <div class="flex items-center gap-2 text-muted text-xs">
          <UIcon name="i-lucide-library" class="size-3.5" />
          {{ t("Learn StatKnowledge") }}
        </div>
        <p class="text-2xl font-bold text-highlighted">
          {{ stats.knowledgeCount }}
        </p>
      </div>
      <div class="space-y-1 rounded-xl border border-default bg-elevated p-4">
        <div class="flex items-center gap-2 text-muted text-xs">
          <UIcon name="i-lucide-pencil-line" class="size-3.5" />
          {{ t("Learn StatNotes") }}
        </div>
        <p class="text-2xl font-bold text-highlighted">{{ stats.noteCount }}</p>
      </div>
      <div class="space-y-1 rounded-xl border border-default bg-elevated p-4">
        <div class="flex items-center gap-2 text-muted text-xs">
          <UIcon name="i-lucide-bookmark" class="size-3.5" />
          {{ t("Learn StatBookmarks") }}
        </div>
        <p class="text-2xl font-bold text-highlighted">
          {{ stats.bookmarkCount }}
        </p>
      </div>
      <div class="space-y-1 rounded-xl border border-default bg-elevated p-4">
        <div class="flex items-center gap-2 text-muted text-xs">
          <UIcon name="i-lucide-clock" class="size-3.5" />
          {{ t("Learn StatHours") }}
        </div>
        <p class="text-2xl font-bold text-highlighted">
          {{ stats.monthlyHours.toFixed(1)
          }}<span class="text-sm font-normal text-muted ml-0.5">{{
            t("Learn StatHoursUnit")
          }}</span>
        </p>
      </div>
      <div class="space-y-1 rounded-xl border border-default bg-elevated p-4">
        <div class="flex items-center gap-2 text-muted text-xs">
          <UIcon name="i-lucide-history" class="size-3.5" />
          {{ t("Learn StatRecords") }}
        </div>
        <p class="text-2xl font-bold text-highlighted">
          {{ stats.recordCount }}
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
      <!-- 近期动态 -->
      <div class="lg:col-span-2 space-y-3">
        <h3 class="text-sm font-semibold text-default">
          {{ t("Learn RecentActivity") }}
        </h3>
        <div v-if="recentActivities.length" class="space-y-3">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-start gap-3 rounded-lg border border-default bg-elevated p-3"
          >
            <div
              class="flex items-center justify-center size-8 rounded-lg bg-secondary/15 shrink-0 mt-0.5"
            >
              <UIcon :name="activityIcon(activity.type)" class="size-4 text-secondary" />
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm text-default">{{ activityLabel(activity) }}</p>
              <p class="text-xs text-muted mt-1">{{ activity.user }} · {{ activity.timestamp }}</p>
            </div>
          </div>
        </div>
        <div v-else class="text-sm text-muted py-8 text-center">
          {{ t("Learn NoActivity") }}
        </div>
      </div>

      <!-- 分类分布 + 本周趋势 -->
      <div class="space-y-5">
        <!-- 分类分布 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-default">
            {{ t("Learn CategoryDistribution") }}
          </h3>
          <div class="rounded-xl border border-default bg-elevated p-4 space-y-3">
            <div
              v-for="item in categoryDistribution"
              :key="item.category"
              class="flex items-center gap-3"
            >
              <div
                :class="[
                  'flex items-center justify-center size-8 rounded-lg shrink-0',
                  `bg-${item.meta.color}/15`,
                ]"
              >
                <UIcon :name="item.meta.icon" :class="['size-4', `text-${item.meta.color}`]" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm text-default">{{ item.meta.label }}</span>
                  <span class="text-xs text-muted">{{ item.count }}</span>
                </div>
                <div class="h-1.5 rounded-full bg-muted/30 overflow-hidden">
                  <div
                    :class="['h-full rounded-full transition-all', `bg-${item.meta.color}`]"
                    :style="{
                      width: `${(item.count / categoryDistribution[0]!.count) * 100}%`,
                    }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 本周学习趋势 -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-default">
            {{ t("Learn WeeklyTrend") }}
          </h3>
          <div class="rounded-xl border border-default bg-elevated p-4">
            <div class="flex items-end justify-between gap-1 h-28">
              <div
                v-for="(day, i) in weeklyTrend"
                :key="i"
                class="flex flex-col items-center gap-1.5 flex-1"
              >
                <span class="text-xs text-muted">{{ day.minutes }}min</span>
                <div
                  class="w-full max-w-[28px] rounded-t-md bg-primary/60 transition-all"
                  :style="{ height: `${(day.minutes / maxMinutes) * 80}%` }"
                />
                <span class="text-xs text-muted">{{ day.day }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
