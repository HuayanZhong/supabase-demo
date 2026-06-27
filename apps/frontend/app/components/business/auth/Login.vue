<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { authSchema, type AuthSchema } from "@supabase/types";

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

const schema = computed(() => authSchema);

async function handleSubmit({ data }: FormSubmitEvent<AuthSchema>) {
  loading.value = true;

  try {
    const res = await $fetch("/api/auth/login", {
      method: "POST",
      body: data,
    });

    if ("error" in res && res.error) {
      toast.add({
        title: t("Login Failed"),
        description: res.error.message || t("Invalid credentials"),
        color: "error",
      });
      return;
    }

    toast.add({
      title: t("Login Success"),
      description: t("Welcome back"),
      color: "success",
    });
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
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :submit="{
      label: $t('Submit'),
      color: 'primary',
      variant: 'solid',
      block: true,
      loading: loading,
    }"
    @submit="handleSubmit"
  >
    <template #footer>
      <div class="flex items-center justify-center gap-1 mt-6 pt-6 border-t border-default">
        <span class="text-sm text-toned">{{ $t("Register Description") }}</span>
        <UButton variant="link" color="primary" size="sm" @click="current = 'register'">
          {{ $t("Register") }}
        </UButton>
      </div>
    </template>
  </UAuthForm>
</template>
