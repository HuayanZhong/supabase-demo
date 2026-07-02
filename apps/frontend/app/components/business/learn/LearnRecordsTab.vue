<script setup lang="ts">
import type { LearningRecord } from "@supabase/types";

const { t } = useI18n();
const { learningRecords, categoryMeta, weeklyTrend } = useLearn();

// 格式化时长
function formatDuration(minutes: number): string {
  if (minutes >= 60) {
    return t("Learn RecordDurationHour", { n: Math.floor(minutes / 60) });
  }
  return t("Learn RecordDurationMin", { n: minutes });
}

// 累计总时长
const totalMinutes = learningRecords.reduce((sum, r) => sum + r.duration, 0);
const totalHours = (totalMinutes / 60).toFixed(1);

const maxMinutes = Math.max(...weeklyTrend.map((d) => d.minutes), 1);

// 按月分组
const groupedByMonth = computed(() => {
  const map: Record<string, LearningRecord[]> = {};
  for (const r of learningRecords) {
    const month = r.date.slice(0, 7); // "2026-06"
    if (!map[month]) map[month] = [];
    map[month].push(r);
  }
  return Object.entries(map).toSorted((a, b) => b[0].localeCompare(a[0])); // 最新月份在前
});
</script>

<template>
  <div class="space-y-5">
    <!-- 统计卡片行 -->
    <div class="grid grid-cols-2 gap-4">
      <div class="rounded-xl border border-default bg-elevated p-4 space-y-2">
        <p class="text-xs text-muted">{{ t("Learn RecordTotalHours") }}</p>
        <p class="text-2xl font-bold text-highlighted">
          {{ totalHours
          }}<span class="text-sm font-normal text-muted ml-0.5">{{
            t("Learn StatHoursUnit")
          }}</span>
        </p>
      </div>
      <div class="rounded-xl border border-default bg-elevated p-4 space-y-2">
        <p class="text-xs text-muted">{{ t("Learn WeeklyTrend") }}</p>
        <div class="flex items-end gap-0.5 h-16">
          <div
            v-for="(day, i) in weeklyTrend"
            :key="i"
            class="flex-1 rounded-t-sm bg-primary/60 transition-all"
            :style="{ height: `${(day.minutes / maxMinutes) * 100}%` }"
          />
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="flex items-center justify-between">
      <h3 class="text-sm font-semibold text-default">
        {{ t("Learn RecordThisMonth") }}
      </h3>
      <UButton
        :label="t('Learn RecordNew')"
        icon="i-lucide-plus"
        color="primary"
        variant="ghost"
        size="sm"
      />
    </div>

    <!-- 学习记录列表 - 按月分组 -->
    <div v-if="groupedByMonth.length" class="space-y-6">
      <div v-for="[month, records] in groupedByMonth" :key="month" class="space-y-3">
        <h4 class="text-xs font-semibold text-muted uppercase tracking-wider">
          {{ month }}
        </h4>
        <div class="space-y-2">
          <div
            v-for="record in records"
            :key="record.id"
            class="flex items-start gap-3 rounded-xl border border-default bg-elevated p-4"
          >
            <!-- 分类图标 -->
            <div
              :class="[
                'flex items-center justify-center size-10 rounded-lg shrink-0',
                `bg-${categoryMeta[record.category]!.color}/15`,
              ]"
            >
              <UIcon
                :name="categoryMeta[record.category]!.icon"
                :class="['size-5', `text-${categoryMeta[record.category]!.color}`]"
              />
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h4 class="text-sm font-semibold text-highlighted">
                  {{ record.topic }}
                </h4>
                <UBadge :color="categoryMeta[record.category]!.color" variant="soft" size="xs">
                  {{ categoryMeta[record.category]!.label }}
                </UBadge>
              </div>
              <p class="text-xs text-toned mt-1 leading-relaxed">
                {{ record.summary }}
              </p>
              <div class="flex items-center gap-3 mt-2 text-xs text-muted">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-clock" class="size-3" />
                  {{ formatDuration(record.duration) }}
                </span>
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-book-open" class="size-3" />
                  {{ record.source }}
                </span>
                <span>{{ record.date }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="text-sm text-muted py-12 text-center">
      {{ t("Learn RecordsNoContent") }}
    </div>
  </div>
</template>
