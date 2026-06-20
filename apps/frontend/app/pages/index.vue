<script setup lang="ts">
import type { AuthFormField } from "@nuxt/ui";

const fields = ref<AuthFormField[]>([
  { name: "email", type: "email", label: "Email", required: true },
  { name: "password", type: "password", label: "Password", required: true },
]);
</script>

<template>
  <div class="flex justify-center items-center h-screen w-screen">
    <UCard class="max-w-md">
      <UAuthForm
        title="Login"
        description="Enter your credentials to access your account."
        icon="i-lucide-user"
        :fields="fields"
      >
        <template #footer>
          <USeparator label="or" class="my-2" />
          <div class="space-y-3">
            <UButton label="QQ" icon="i-simple-icons-qq" color="neutral" variant="subtle" block />
            <UButton
              label="微信"
              icon="i-simple-icons-wechatpay"
              color="neutral"
              variant="subtle"
              block
            />
          </div>
        </template>
      </UAuthForm>
    </UCard>
  </div>
</template>
