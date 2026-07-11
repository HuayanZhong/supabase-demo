<script setup lang="ts">
// 最近文件列表卡片
const { t } = useI18n();

const files = [
  {
    name: t("File ProjectPlan"),
    icon: "i-lucide-file-text",
    time: t("Time HoursAgo", { n: 2 }),
    size: "128 KB",
    color: "primary" as const,
  },
  {
    name: t("File DesignDraft"),
    icon: "i-lucide-figma",
    time: t("Time HoursAgo", { n: 5 }),
    size: "2.4 MB",
    color: "warning" as const,
  },
  {
    name: t("File ApiDocs"),
    icon: "i-lucide-file-code",
    time: t("Time Yesterday"),
    size: "64 KB",
    color: "info" as const,
  },
  {
    name: t("File MeetingNotes"),
    icon: "i-lucide-notebook-pen",
    time: t("Time Yesterday"),
    size: "32 KB",
    color: "success" as const,
  },
];
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden">
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-4">
      <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
        <UIcon name="i-lucide-folder-open" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("RecentFiles") }}</span>
    </div>
    <div class="px-5 pb-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      <div
        v-for="file in files"
        :key="file.name"
        class="flex items-center gap-3 p-3 rounded-lg bg-elevated cursor-pointer transition-all duration-150 hover:bg-muted/50 hover:shadow-sm"
      >
        <div
          class="flex items-center justify-center size-10 rounded-lg shrink-0"
          :class="{
            'bg-elevated': file.color === 'primary',
            'bg-warning/10': file.color === 'warning',
            'bg-info/10': file.color === 'info',
            'bg-success/10': file.color === 'success',
          }"
        >
          <UIcon
            :name="file.icon"
            class="size-5"
            :class="{
              'text-primary': file.color === 'primary',
              'text-warning': file.color === 'warning',
              'text-info': file.color === 'info',
              'text-success': file.color === 'success',
            }"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-default truncate">
            {{ file.name }}
          </p>
          <div class="flex items-center gap-1.5 text-xs text-muted mt-0.5">
            <span>{{ file.time }}</span>
            <span class="text-muted/50">·</span>
            <span>{{ file.size }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
