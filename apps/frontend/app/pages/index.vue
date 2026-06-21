<script setup lang="ts">
import { BusinessAuthLogin, LazyBusinessAuthRegister } from "#components";

// 默认显示登录
const current = ref<"login" | "register">("login");

// 动态切换组件
const currentComponent = computed(() => {
  return current.value === "login" ? BusinessAuthLogin : LazyBusinessAuthRegister;
});
</script>

<template>
  <div class="flex justify-center items-center min-h-dvh px-4">
    <div class="fixed top-4 right-4 flex items-center gap-x-2">
      <UColorModeButton />
      <CommonLocaleSelect />
    </div>
    <component :is="currentComponent" v-model="current" />
  </div>
</template>
