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

const handleSubmit = async ({ data }: FormSubmitEvent<AuthSchema>) => {
  loading.value = true;

  try {
    const res = await $fetch("/api/auth/register", {
      method: "POST",
      body: data,
    });

    if ("error" in res && res.error) {
      toast.add({
        title: t("Register Failed"),
        description: res.error.message || t("Registration failed"),
        color: "error",
      });
      return;
    }

    toast.add({
      title: t("Register Success"),
      description: t("Please check your email to verify your account"),
      color: "success",
    });

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
  <UAuthForm
    :schema="schema"
    :fields="fields"
    :submit="{
      label: $t('Register Submit'),
      color: 'primary',
      variant: 'solid',
      block: true,
      loading: loading,
    }"
    @submit="handleSubmit"
  >
    <template #footer>
      <div class="flex items-center justify-center gap-1 mt-6 pt-6 border-t border-default">
        <span class="text-sm text-toned">{{ $t("Login Description") }}</span>
        <UButton variant="link" color="primary" size="sm" @click="current = 'login'">
          {{ $t("Login") }}
        </UButton>
      </div>
    </template>
  </UAuthForm>
</template>
