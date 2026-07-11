<script setup lang="ts">
const { t } = useI18n();
const { userProfile } = useSettings();
</script>

<template>
  <div class="rounded-xl border border-default bg-default p-6">
    <h3 class="text-base font-semibold text-highlighted mb-4">
      {{ t("Settings ProfileTitle") }}
    </h3>

    <!-- 头像 -->
    <div class="flex items-center gap-4 mb-6">
      <div class="flex items-center justify-center size-16 rounded-full bg-elevated shrink-0">
        <UIcon :name="userProfile.avatar" class="size-8 text-primary" />
      </div>
      <div>
        <p class="text-sm font-medium text-highlighted">{{ userProfile.name }}</p>
        <p class="text-xs text-toned">{{ userProfile.email }}</p>
      </div>
    </div>

    <!-- 资料字段 -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <label class="text-sm font-medium text-default mb-1.5 block">
          {{ t("Settings Name") }}
        </label>
        <input
          :value="userProfile.name"
          class="w-full rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm text-default outline-none focus:border-primary transition-colors"
          readonly
        />
      </div>
      <div>
        <label class="text-sm font-medium text-default mb-1.5 block">
          {{ t("Settings Email") }}
        </label>
        <input
          :value="userProfile.email"
          class="w-full rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm text-default outline-none focus:border-primary transition-colors"
          readonly
        />
      </div>
      <div class="lg:col-span-2">
        <label class="text-sm font-medium text-default mb-1.5 block">
          {{ t("Settings Bio") }}
        </label>
        <textarea
          :value="userProfile.bio"
          rows="3"
          class="w-full rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm text-default outline-none focus:border-primary transition-colors resize-none"
          readonly
        />
      </div>
    </div>
  </div>
</template>
