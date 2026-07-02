<script setup lang="ts">
import type { Project } from "@supabase/types";

const { t } = useI18n();

defineProps<{
  project: Project;
}>();
</script>

<template>
  <div class="space-y-6 max-w-2xl">
    <!-- 通用设置 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <h3 class="text-base font-semibold text-highlighted mb-4">
        {{ t("Project SettingsGeneral") }}
      </h3>
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-default mb-1.5 block">{{
            t("Project SettingsName")
          }}</label>
          <input
            :value="project.name"
            class="w-full rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-default outline-none focus:border-primary transition-colors"
            readonly
          />
        </div>
        <div>
          <label class="text-sm font-medium text-default mb-1.5 block">{{
            t("Project SettingsDesc")
          }}</label>
          <textarea
            :value="project.description"
            rows="3"
            class="w-full rounded-lg border border-default bg-elevated px-3 py-2 text-sm text-default outline-none focus:border-primary transition-colors resize-none"
            readonly
          />
        </div>
      </div>
    </div>

    <!-- 危险区域 -->
    <div class="rounded-xl border border-error/20 bg-error/5 p-6">
      <h3 class="text-base font-semibold text-error mb-4">{{ t("Project SettingsDanger") }}</h3>
      <div class="space-y-3">
        <div class="flex items-center justify-between p-3 rounded-lg bg-default">
          <div>
            <p class="text-sm font-medium text-default">{{ t("Project SettingsArchive") }}</p>
            <p class="text-xs text-toned mt-0.5">{{ t("Project SettingsArchiveDesc") }}</p>
          </div>
          <UButton color="warning" variant="soft" size="sm">
            {{ t("Project SettingsArchive") }}
          </UButton>
        </div>
        <div class="flex items-center justify-between p-3 rounded-lg bg-default">
          <div>
            <p class="text-sm font-medium text-default">{{ t("Project SettingsDelete") }}</p>
            <p class="text-xs text-toned mt-0.5">{{ t("Project SettingsDeleteDesc") }}</p>
          </div>
          <UButton color="error" variant="soft" size="sm">
            {{ t("Project SettingsDelete") }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
