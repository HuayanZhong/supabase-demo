<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { authSchema, type AuthSchema } from "@supabase/types";

const current = defineModel<"login" | "register">();

const { t } = useI18n();
const toast = useToast();
const loading = ref(false);
const { setAuthed } = useAuth();

// 登录表单字段
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

// 登录表单验证规则
const schema = computed(() => authSchema);

// 发送登录请求
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

    // 登录成功，刷新客户端 session 后跳转仪表盘
    await setAuthed();
    await navigateTo("/dashboard/home");
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
  <UCard class="max-w-md">
    <template #header>
      <div class="text-center">
        <h2 class="text-lg font-semibold text-default">{{ $t("Login") }}</h2>
        <p class="text-sm text-toned mt-1">{{ $t("Description") }}</p>
      </div>
    </template>

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
    />

    <template #footer>
      <div class="text-center text-sm">
        <span class="text-toned">{{ $t("Register Description") }}</span>
        <UButton
          variant="link"
          color="primary"
          size="sm"
          class="ml-1"
          @click="current = 'register'"
        >
          {{ $t("Register") }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
