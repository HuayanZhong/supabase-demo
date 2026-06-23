<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import type { AuthSchema } from "@supabase/types";

// 定义切换状态
const current = defineModel<"login" | "register">();

const { t } = useI18n();
const toast = useToast();
const loading = ref(false);

const fields = computed<AuthFormField[]>(() => [
  {
    name: "email",
    type: "email",
    label: t("Email"),
    required: true,
    placeholder: t("InputPlaceholder Email"),
    validation: (value: string) => {
      if (!value) return t("Validation Email Required");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return t("Validation Email Invalid");
      return true;
    },
  },
  {
    name: "password",
    type: "password",
    label: t("Password"),
    required: true,
    placeholder: t("InputPlaceholder Password"),
    validation: (value: string) => {
      if (!value) return t("Validation Password Required");
      if (value.length < 8) return t("Validation Password Min");
      return true;
    },
  },
]);

// 点击登录
async function handleSubmit({ data }: FormSubmitEvent<AuthSchema>) {
  loading.value = true;

  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: data,
    });

    // 检查返回结果
    if ("error" in res && res.error) {
      toast.add({
        title: t("Login Failed"),
        description: res.error.message || t("Invalid credentials"),
        color: "error",
      });
      return;
    }

    // 登录成功
    toast.add({
      title: t("Login Success"),
      description: t("Welcome back"),
      color: "success",
    });

    // 跳转到首页或其他页面
    await navigateTo("/");
  } catch (error) {
    toast.add({
      title: t("Error"),
      description: t("Network error, please try again"),
      color: "error",
    });
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <UCard class="min-w-[20vw] max-w-md">
    <UAuthForm
      :title="$t('Login')"
      :description="$t('Description')"
      icon="i-lucide-user"
      :fields="fields"
      :submit="{
        label: $t('Submit'),
        color: 'primary',
        variant: 'subtle',
        loading: loading,
      }"
      @submit="handleSubmit"
    >
      <template #footer>
        <USeparator :label="$t('Quick login')" class="my-2" />
        <div class="space-y-3">
          <UButton :label="$t('QQ')" color="neutral" variant="subtle" block />
          <UButton :label="$t('Wechat')" color="neutral" variant="subtle" block />
        </div>
        <div class="w-full flex justify-end items-center mt-4">
          <p>
            {{ $t("Register Description") }}
          </p>
          <UButton variant="link" @click="current = 'register'">{{ $t("Register") }}</UButton>
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
