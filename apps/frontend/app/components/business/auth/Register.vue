<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { z } from "zod";

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

const schema = z.object({
  email: z.email("Invalid email"),
  password: z.string("Password is required").min(8, "Must be at least 8 characters"),
});

type Schema = z.output<typeof schema>;

const handleSubmit = async ({ data }: FormSubmitEvent<Schema>) => {
  console.log(data);
};
</script>

<template>
  <UCard class="min-w-[20vw] max-w-md">
    <UAuthForm
      :title="$t('Register')"
      :description="$t('Register Form Description')"
      icon="i-lucide-user-plus"
      :fields="fields"
      :submit="{
        label: $t('Register Submit'),
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
            {{ $t("Login Description") }}
          </p>
          <UButton variant="link" @click="current = 'login'">{{ $t("Login") }}</UButton>
        </div>
      </template>
    </UAuthForm>
  </UCard>
</template>
