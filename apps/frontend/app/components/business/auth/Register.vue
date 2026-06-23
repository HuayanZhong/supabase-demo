<script setup lang="ts">
import * as z from "zod";
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
  },
  {
    name: "password",
    type: "password",
    label: t("Password"),
    required: true,
    placeholder: t("InputPlaceholder Password"),
  },
]);

const schema = computed(() =>
  z.object({
    email: z.string(t("Validation Email Required")).email(t("Validation Email Invalid")),
    password: z.string(t("Validation Password Required")).min(8, t("Validation Password Min")),
  }),
);

const handleSubmit = async ({ data }: FormSubmitEvent<AuthSchema>) => {
  loading.value = true;

  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: data,
    });

    // 检查返回结果
    if ("error" in res && res.error) {
      toast.add({
        title: t("Register Failed"),
        description: res.error.message || t("Registration failed"),
        color: "error",
      });
      return;
    }

    // 注册成功
    toast.add({
      title: t("Register Success"),
      description: t("Please check your email to verify your account"),
      color: "success",
    });

    // 切换到登录页面
    current.value = "login";
  } catch (error) {
    toast.add({
      title: t("Error"),
      description: t("Network error, please try again"),
      color: "error",
    });
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <UCard class="min-w-[20vw] max-w-md">
    <UAuthForm
      :title="$t('Register')"
      :description="$t('Register Form Description')"
      icon="i-lucide-user-plus"
      :schema="schema"
      :fields="fields"
      :submit="{
        label: $t('Register Submit'),
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
            {{ $t("Login Description") }}
          </p>
          <UButton variant="link" @click="current = 'login'">{{ $t("Login") }}</UButton>
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
