<script setup lang="ts">
// 工作空间列表卡片
const { t } = useI18n();

const workspaces = [
  {
    name: t("Workspace Frontend"),
    icon: "i-lucide-code-2",
    members: 3,
    color: "primary" as const,
  },
  {
    name: t("Workspace Design"),
    icon: "i-lucide-palette",
    members: 2,
    color: "info" as const,
  },
  {
    name: t("Workspace Learning"),
    icon: "i-lucide-graduation-cap",
    members: 1,
    color: "success" as const,
  },
];
</script>

<template>
  <div class="rounded-xl border border-default bg-default overflow-hidden">
    <div class="flex items-center gap-2.5 px-5 pt-5 pb-4">
      <div class="flex items-center justify-center size-8 rounded-lg bg-elevated">
        <UIcon name="i-lucide-layout-grid" class="size-4 text-primary" />
      </div>
      <span class="font-semibold text-highlighted">{{ t("MyWorkspace") }}</span>
    </div>
    <div class="px-5 pb-5 space-y-2">
      <div
        v-for="ws in workspaces"
        :key="ws.name"
        class="flex items-center gap-3 p-3 rounded-lg bg-elevated cursor-pointer transition-all duration-150 hover:bg-muted/50 hover:shadow-sm"
      >
        <div
          class="flex items-center justify-center size-10 rounded-lg shrink-0"
          :class="{
            'bg-elevated': ws.color === 'primary',
            'bg-info/10': ws.color === 'info',
            'bg-success/10': ws.color === 'success',
          }"
        >
          <UIcon
            :name="ws.icon"
            class="size-5"
            :class="{
              'text-primary': ws.color === 'primary',
              'text-info': ws.color === 'info',
              'text-success': ws.color === 'success',
            }"
          />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-default truncate">{{ ws.name }}</p>
          <p class="text-xs text-muted mt-0.5">{{ ws.members }} {{ t("Members") }}</p>
        </div>
        <UIcon name="i-lucide-chevron-right" class="size-4 text-muted shrink-0" />
      </div>
    </div>
  </div>
</template>
