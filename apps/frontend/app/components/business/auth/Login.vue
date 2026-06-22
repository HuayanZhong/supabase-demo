<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import type { AuthSchema } from "@supabase/types";

// 定义切换状态
const current = defineModel<"login" | "register">();

const fields = ref<AuthFormField[]>([
  {
    name: "email",
    type: "email",
    label: $t("Email"),
    required: true,
    placeholder: $t("InputPlaceholder Email"),
  },
  {
    name: "password",
    type: "password",
    label: $t("Password"),
    required: true,
    placeholder: $t("InputPlaceholder Password"),
  },
]);

// 点击登录
async function handleSubmit({ data }: FormSubmitEvent<AuthSchema>) {
  console.log(data);
  const res = await $fetch("/api/auth/login", {
    method: "POST",
    body: data,
  });
  console.log(res);
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
