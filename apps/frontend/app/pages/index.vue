<script setup lang="ts">
import { BusinessAuthLogin, LazyBusinessAuthRegister } from "#components";

const current = ref<"login" | "register">("login");

const currentComponent = computed(() => {
  return current.value === "login" ? BusinessAuthLogin : LazyBusinessAuthRegister;
});

const { t } = useI18n();
</script>

<template>
  <div class="min-h-dvh flex flex-col lg:flex-row">
    <!-- 左侧品牌区 -->
    <div
      class="relative flex items-center justify-center px-8 lg:px-16 py-16 lg:py-0 lg:w-[440px] bg-primary-600 overflow-hidden select-none"
    >
      <!-- 几何装饰：纯 CSS，无渐变无模糊 -->
      <div
        class="absolute -top-28 -right-28 size-72 rounded-full border-[28px] border-primary-400/25"
      />
      <div class="absolute -bottom-16 -left-16 size-52 rounded-full bg-primary-400/15" />
      <div class="absolute top-1/3 left-0 w-32 h-px bg-primary-300/20" />
      <div class="absolute bottom-1/4 right-12 w-20 h-px bg-primary-300/15" />

      <div class="relative text-center lg:text-left">
        <div class="flex items-center justify-center lg:justify-start gap-3 mb-10">
          <div class="size-9 rounded-lg bg-white flex items-center justify-center">
            <span class="text-base font-bold text-primary-600">G</span>
          </div>
          <span class="text-lg font-semibold text-white/90 tracking-tight">Growth OS</span>
        </div>

        <h1
          class="text-[28px] lg:text-[32px] font-bold text-white leading-snug mb-4 tracking-tight"
        >
          Every Goal Deserves<br />
          a Growing Companion.
        </h1>
        <p class="text-sm text-white/60 leading-relaxed max-w-xs mx-auto lg:mx-0">
          围绕你的目标持续提供支持，记录成长过程，<br />帮助你不断调整成长路径。
        </p>
      </div>
    </div>

    <!-- 右侧表单区 -->
    <div class="flex-1 flex flex-col bg-default">
      <!-- 顶栏操作区 -->
      <div class="flex items-center justify-end px-4 lg:px-6 h-14 gap-1">
        <UColorModeButton />
        <CommonLocaleSelect />
      </div>

      <!-- 表单 -->
      <div class="flex-1 flex items-center justify-center px-6 pb-16 lg:pb-0">
        <div class="w-full max-w-sm">
          <!-- 表单标题 -->
          <div class="mb-8">
            <h2 class="text-xl font-semibold text-default">
              {{ current === "login" ? t("Login") : t("Register") }}
            </h2>
            <p class="text-sm text-toned mt-1">
              {{
                current === "login"
                  ? "登录你的账号，继续你的成长之旅"
                  : "创建账号，开启你的成长之旅"
              }}
            </p>
          </div>

          <component :is="currentComponent" v-model="current" />
        </div>
      </div>
    </div>
  </div>
</template>
