<!--
登录表单组件。
用户在点击"提交"按钮时通过 $fetch 发送 POST /api/auth/login 请求。
$fetch 优于 useFetch：该请求由点击事件触发，非 SSR 初始化数据获取。
-->
<script setup lang="ts">
import type { AuthFormField, FormSubmitEvent } from "@nuxt/ui";
import { authSchema, type AuthSchema } from "@supabase/types";

const current = defineModel<"login" | "register">();

const { t } = useI18n();
const toast = useToast();
const loadingRef = ref(false);
const { setAuthed } = useAuth();

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
  loadingRef.value = true;

  try {
    // POST /api/auth/login 由点击事件触发，$fetch 比 useFetch 更适合事件处理场景
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

    // 登录成功后刷新客户端 session 后跳转仪表盘
    await setAuthed();
    await navigateTo("/dashboard/home");
  } catch (error) {
    toast.add({
      title: t("Error"),
      description: t("Network error, please try again"),
      color: "error",
    });
  } finally {
    loadingRef.value = false;
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
        loading: loadingRef,
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
          @click="void (current = 'register')"
        >
          {{ $t("Register") }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
