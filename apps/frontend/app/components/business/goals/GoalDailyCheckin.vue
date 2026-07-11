<script setup lang="ts">
const { t } = useI18n();

const streak = 23;

const weekDays = computed(() => {
  const labels = [
    t("Weekday Mon"),
    t("Weekday Tue"),
    t("Weekday Wed"),
    t("Weekday Thu"),
    t("Weekday Fri"),
    t("Weekday Sat"),
    t("Weekday Sun"),
  ];
  // 模拟：周一到周五已打卡，周六未打卡，周日（今天）待打卡
  const checked = [true, true, true, true, true, false, false];
  const todayIndex = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1;
  return labels.map((label, i) => ({
    label,
    checked: checked[i],
    isToday: i === todayIndex,
  }));
});

const isCheckedInRef = ref(false);

function handleCheckin() {
  isCheckedInRef.value = true;
}
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden flex flex-col">
    <!-- 头部 -->
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-4">
      <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
        <UIcon name="i-lucide-flame" class="size-4 text-warning" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("Checkin Title") }}</span>
    </div>

    <!-- 连续天数 -->
    <div class="px-5 pb-4 flex items-center gap-4">
      <div class="flex items-center justify-center size-16 rounded-2xl bg-elevated">
        <span class="text-2xl font-bold text-warning">{{ streak }}</span>
      </div>
      <div>
        <p class="text-sm font-semibold text-highlighted">
          {{ t("Checkin Streak") }}
        </p>
        <p class="text-xs text-muted mt-0.5">{{ t("Checkin StreakDesc") }}</p>
      </div>
    </div>

    <!-- 本周打卡 -->
    <div class="px-5 pb-4">
      <p class="text-xs text-muted mb-2.5 font-medium">
        {{ t("Checkin ThisWeek") }}
      </p>
      <div class="grid grid-cols-7 gap-1.5">
        <div v-for="(day, index) in weekDays" :key="index" class="flex flex-col items-center gap-1">
          <span class="text-[10px] text-muted">{{ day.label }}</span>
          <div
            class="size-8 rounded-full flex items-center justify-center transition-colors duration-150"
            :class="{
              'bg-warning text-white': day.checked,
              'bg-elevated text-muted': !day.checked && !day.isToday,
              'ring-2 ring-warning ring-offset-1 bg-default text-warning':
                day.isToday && !day.checked,
              'bg-warning text-white ring-2 ring-warning ring-offset-1': day.isToday && day.checked,
            }"
          >
            <UIcon v-if="day.checked" name="i-lucide-check" class="size-3.5" />
            <span v-else class="text-[10px] font-medium">
              {{ day.isToday ? "今" : "" }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 签到按钮区域 -->
    <div class="px-5 pb-5 mt-auto">
      <UButton
        v-if="!isCheckedInRef"
        color="warning"
        variant="solid"
        block
        icon="i-lucide-check-circle"
        @click="handleCheckin"
      >
        {{ t("Checkin Button") }}
      </UButton>
      <div
        v-else
        class="flex items-center justify-center gap-2 py-2.5 rounded-lg bg-elevated text-warning text-sm font-medium"
      >
        <UIcon name="i-lucide-circle-check" class="size-4" />
        {{ t("Checkin Done") }}
      </div>
    </div>
  </div>
</template>
