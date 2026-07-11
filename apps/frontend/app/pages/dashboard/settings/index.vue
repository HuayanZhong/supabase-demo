<!--
设置页面，包含 profile/account/notifications 三个标签页。
通过 activeTabRef 控制当前显示的设置面板。
-->
<script setup lang="ts">
definePageMeta({ title: "Settings" });

const { t } = useI18n();
const activeTabRef = ref("profile");

const tabs = [
  { id: "profile", label: t("Settings TabProfile"), icon: "i-lucide-user" },
  { id: "account", label: t("Settings TabAccount"), icon: "i-lucide-shield" },
  {
    id: "notifications",
    label: t("Settings TabNotifications"),
    icon: "i-lucide-bell",
  },
];
</script>

<template>
  <div class="space-y-6">
    <div>
      <h1 class="text-2xl font-bold text-highlighted">
        {{ t("Settings Title") }}
      </h1>
      <p class="text-sm text-toned mt-1">{{ t("Settings Description") }}</p>
    </div>

    <div class="flex items-center gap-1 border-b border-default pb-0">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors duration-150 border-b-2 -mb-px"
        :class="
          activeTabRef === tab.id
            ? 'border-primary text-primary'
            : 'border-transparent text-muted hover:text-default hover:border-default'
        "
        @click="activeTabRef = tab.id"
      >
        <UIcon :name="tab.icon" class="size-4" />
        {{ tab.label }}
      </button>
    </div>

    <BusinessSettingsProfile v-if="activeTabRef === 'profile'" />
    <BusinessSettingsAccount v-else-if="activeTabRef === 'account'" />
    <BusinessSettingsNotifications v-else-if="activeTabRef === 'notifications'" />
  </div>
</template>
