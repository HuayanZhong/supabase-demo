<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <div class="space-y-6">
    <h1 class="text-2xl font-bold text-highlighted">仪表盘</h1>

    <!-- 统计卡片 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-muted">
            <UIcon name="i-lucide-folder-kanban" class="size-4" />
            <span class="text-sm">项目数</span>
          </div>
        </template>
        <p class="text-3xl font-bold">--</p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-muted">
            <UIcon name="i-lucide-users" class="size-4" />
            <span class="text-sm">团队成员</span>
          </div>
        </template>
        <p class="text-3xl font-bold">--</p>
      </UCard>

      <UCard>
        <template #header>
          <div class="flex items-center gap-2 text-muted">
            <UIcon name="i-lucide-activity" class="size-4" />
            <span class="text-sm">活跃度</span>
          </div>
        </template>
        <p class="text-3xl font-bold">--</p>
      </UCard>
    </div>
  </div>
</template>
