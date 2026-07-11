<script setup lang="ts">
const { t } = useI18n();
const { notificationSettings, updateNotification } = useSettings();

function handleToggle(key: "emailNotifications" | "pushNotifications" | "weeklyDigest") {
  updateNotification(key, !notificationSettings.value[key]);
}
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-semibold text-highlighted mb-4">
      {{ t("Settings NotificationsTitle") }}
    </h3>

    <!-- 邮件通知 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings EmailNotifications") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{ t("Settings EmailNotificationsDesc") }}
        </p>
      </div>
      <USwitch
        :model-value="notificationSettings.emailNotifications"
        color="primary"
        size="md"
        @update:model-value="handleToggle('emailNotifications')"
      />
    </div>

    <!-- 推送通知 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings PushNotifications") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{ t("Settings PushNotificationsDesc") }}
        </p>
      </div>
      <USwitch
        :model-value="notificationSettings.pushNotifications"
        color="primary"
        size="md"
        @update:model-value="handleToggle('pushNotifications')"
      />
    </div>

    <!-- 每周摘要 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings WeeklyDigest") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{ t("Settings WeeklyDigestDesc") }}
        </p>
      </div>
      <USwitch
        :model-value="notificationSettings.weeklyDigest"
        color="primary"
        size="md"
        @update:model-value="handleToggle('weeklyDigest')"
      />
    </div>
  </div>
</template>
