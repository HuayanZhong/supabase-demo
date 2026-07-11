<script setup lang="ts">
definePageMeta({
  title: "Settings",
});

const { t } = useI18n();

const activeTab = ref("profile");

const tabs = [
  { id: "profile", label: t("Settings TabProfile"), icon: "i-lucide-user" },
  { id: "account", label: t("Settings TabAccount"), icon: "i-lucide-shield" },
  {
    id: "notifications",
    label: t("Settings TabNotifications"),
    icon: "i-lucide-bell",
  },
];

// 显式导入子组件（Nuxt 自动导入在特定情况下可能不生效）
import SettingsProfile from "~/components/business/settings/SettingsProfile.vue";
import SettingsAccount from "~/components/business/settings/SettingsAccount.vue";
import SettingsNotifications from "~/components/business/settings/SettingsNotifications.vue";

const tabComponents: Record<string, Component> = {
  profile: SettingsProfile,
  account: SettingsAccount,
  notifications: SettingsNotifications,
};
</script>

<template>
  <div class="space-y-6">
    <!-- 页面头部 -->
    <div>
      <h1 class="text-2xl font-bold text-highlighted">
        {{ t("Settings Title") }}
      </h1>
      <p class="text-sm text-toned mt-1">{{ t("Settings Description") }}</p>
    </div>

    <!-- Tab 导航 -->
    <div class="flex items-center gap-1 border-b border-default pb-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors duration-150 border-b-2 -mb-px"
        :class="
          activeTab === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-muted hover:text-default hover:border-default'
        "
        @click="activeTab = tab.id"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Tab 内容 -->
    <component :is="tabComponents[activeTab]" />
  </div>
</template>
