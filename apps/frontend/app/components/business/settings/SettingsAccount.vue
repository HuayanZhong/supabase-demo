<script setup lang="ts">
const { t } = useI18n();
const { accountSettings } = useSettings();
</script>

<template>
  <div class="space-y-4">
    <h3 class="text-base font-semibold text-highlighted mb-4">
      {{ t("Settings AccountTitle") }}
    </h3>

    <!-- 两步验证 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings TwoFactor") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{
            accountSettings.twoFactorEnabled
              ? t("Settings TwoFactorEnabled")
              : t("Settings TwoFactorDisabled")
          }}
        </p>
      </div>
      <UBadge
        :color="accountSettings.twoFactorEnabled ? 'success' : 'neutral'"
        variant="soft"
        size="sm"
      >
        {{ accountSettings.twoFactorEnabled ? t("Settings StatusOn") : t("Settings StatusOff") }}
      </UBadge>
    </div>

    <!-- 最后登录时间 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings LastLogin") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{ accountSettings.lastLogin }}
        </p>
      </div>
      <UIcon name="i-lucide-clock" class="size-5 text-muted shrink-0" />
    </div>

    <!-- 注册时间 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings MemberSince") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{ accountSettings.memberSince }}
        </p>
      </div>
      <UIcon name="i-lucide-calendar" class="size-5 text-muted shrink-0" />
    </div>

    <!-- 修改密码 -->
    <div class="rounded-xl border border-default bg-default p-4 flex items-center justify-between">
      <div>
        <p class="text-sm font-medium text-default">
          {{ t("Settings ChangePassword") }}
        </p>
        <p class="text-xs text-toned mt-0.5">
          {{ t("Settings ChangePasswordDesc") }}
        </p>
      </div>
      <UButton color="primary" variant="soft" size="sm" class="shrink-0">
        {{ t("Settings ChangePassword") }}
      </UButton>
    </div>
  </div>
</template>
