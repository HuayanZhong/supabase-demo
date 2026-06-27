<script setup lang="ts">
import { BusinessAuthLogin, LazyBusinessAuthRegister } from "#components";

const current = ref<"login" | "register">("login");

const currentComponent = computed(() => {
  return current.value === "login" ? BusinessAuthLogin : LazyBusinessAuthRegister;
});
</script>

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

    <!-- 登录/注册表单 -->
    <div class="w-full max-w-sm">
      <component :is="currentComponent" v-model="current" />
    </div>
  </div>
</template>
