<script setup lang="ts">
definePageMeta({
  layout: "dashboard",
  middleware: "auth",
});
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-highlighted">项目空间</h1>
      <UButton color="primary" icon="i-lucide-plus"> 新建项目 </UButton>
    </div>

    <p class="text-muted">暂无项目，点击「新建项目」开始。</p>
  </div>
</template>
