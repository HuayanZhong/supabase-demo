<template>
  <div class="min-h-dvh flex flex-col items-center justify-center px-6">
    <!-- 顶栏操作区 -->
    <div class="fixed top-0 left-0 right-0 flex items-center justify-between px-4 h-12">
      <div class="flex items-center gap-2">
        <UIcon name="i-lucide-sprout" class="size-5 text-primary" />
        <span class="text-sm font-semibold text-default">Growth OS</span>
      </div>
      <div class="flex items-center gap-0.5">
        <UColorModeButton />
        <CommonLocaleSelect />
      </div>
    </div>

    <!-- 成功提示卡片 -->
    <UCard class="max-w-md w-full text-center">
      <div class="flex flex-col items-center gap-4 py-6">
        <div class="size-14 rounded-full bg-success/10 flex items-center justify-center">
          <UIcon name="i-lucide-circle-check-big" class="size-7 text-success" />
        </div>

        <h2 class="text-xl font-semibold text-default">
          {{ $t("Verify Email Success") }}
        </h2>

        <p class="text-sm text-toned leading-relaxed max-w-xs">
          {{ $t("Verify Email Success Description") }}
        </p>
      </div>
    </UCard>
  </div>
</template>
