<!--
注册表单组件。
用户在点击"提交"按钮时通过 $fetch 发送 POST /api/auth/register 请求。
$fetch 优于 useFetch：该请求由点击事件触发，非 SSR 初始化数据获取。
-->
<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { authSchema, type AuthSchema } from "@supabase/types";

const current = defineModel<"login" | "register">();

const { t } = useI18n();
const toast = useToast();
const loadingRef = ref(false);

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
  loadingRef.value = true;

  try {
    // POST /api/auth/register 由点击事件触发，$fetch 比 useFetch 更适合事件处理场景
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
    loadingRef.value = false;
  }
};
</script>

<template>
  <UCard class="max-w-md">
    <template #header>
      <div class="text-center">
        <h2 class="text-lg font-semibold text-default">{{ $t("Register") }}</h2>
        <p class="text-sm text-toned mt-1">
          {{ $t("Register Form Description") }}
        </p>
      </div>
    </template>

    <UAuthForm
      :schema="schema"
      :fields="fields"
      :submit="{
        label: $t('Register Submit'),
        color: 'primary',
        variant: 'solid',
        block: true,
        loading: loadingRef,
      }"
      @submit="handleSubmit"
    />

    <template #footer>
      <div class="text-center text-sm">
        <span class="text-toned">{{ $t("Login Description") }}</span>
        <UButton
          variant="link"
          color="primary"
          size="sm"
          class="ml-1"
          @click="void (current = 'login')"
        >
          {{ $t("Login") }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
