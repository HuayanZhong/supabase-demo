<script setup lang="ts">
import type { Project } from "@supabase/types";

const { t } = useI18n();

defineProps<{
  project: Project;
}>();
</script>

<template>
  <div class="space-y-6">
    <!-- 通用设置 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <h3 class="text-base font-semibold text-highlighted mb-4">
        {{ t("Project SettingsGeneral") }}
      </h3>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <label class="text-sm font-medium text-default mb-1.5 block">{{
            t("Project SettingsName")
          }}</label>
          <input
            :value="project.name"
            class="w-full rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm text-default outline-none focus:border-primary transition-colors"
            readonly
          />
        </div>
        <div class="lg:col-span-2">
          <label class="text-sm font-medium text-default mb-1.5 block">{{
            t("Project SettingsDesc")
          }}</label>
          <textarea
            :value="project.description"
            rows="3"
            class="w-full rounded-lg border border-default bg-elevated px-4 py-2.5 text-sm text-default outline-none focus:border-primary transition-colors resize-none"
            readonly
          />
        </div>
        <div>
          <label class="text-sm font-medium text-default mb-1.5 block">{{
            t("Project Status")
          }}</label>
          <UBadge color="success" variant="soft" size="md">
            {{ t("Project Active") }}
          </UBadge>
        </div>
        <div>
          <label class="text-sm font-medium text-default mb-1.5 block">{{
            t("Project Members")
          }}</label>
          <p class="text-sm text-default">{{ project.members }} {{ t("Project MembersUnit") }}</p>
        </div>
      </div>
    </div>

    <!-- 统计信息 -->
    <div class="rounded-xl border border-default bg-default p-6">
      <h3 class="text-base font-semibold text-highlighted mb-4">
        {{ t("Project SettingsStats") }}
      </h3>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-trending-up" class="size-8 text-success shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project ProgressTitle") }}</p>
            <p class="text-xl font-bold text-highlighted">{{ project.progress }}%</p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-check-circle-2" class="size-8 text-info shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project TaskCompletion") }}</p>
            <p class="text-xl font-bold text-highlighted">
              {{ project.tasks.done }}/{{ project.tasks.total }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-3 p-4 rounded-lg bg-elevated">
          <UIcon name="i-lucide-calendar" class="size-8 text-warning shrink-0" />
          <div>
            <p class="text-xs text-toned">{{ t("Project Milestones") }}</p>
            <p class="text-xl font-bold text-highlighted">
              {{ project.milestones.filter((m) => m.status === "completed").length }}/{{
                project.milestones.length
              }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- 危险区域 -->
    <div class="rounded-xl border border-error/20 bg-error/5 p-6">
      <h3 class="text-base font-semibold text-error mb-4">{{ t("Project SettingsDanger") }}</h3>
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div class="flex items-center justify-between p-4 rounded-lg bg-default">
          <div class="mr-4">
            <p class="text-sm font-medium text-default">{{ t("Project SettingsArchive") }}</p>
            <p class="text-xs text-toned mt-0.5">{{ t("Project SettingsArchiveDesc") }}</p>
          </div>
          <UButton color="warning" variant="soft" size="sm" class="shrink-0">
            {{ t("Project SettingsArchive") }}
          </UButton>
        </div>
        <div class="flex items-center justify-between p-4 rounded-lg bg-default">
          <div class="mr-4">
            <p class="text-sm font-medium text-default">{{ t("Project SettingsDelete") }}</p>
            <p class="text-xs text-toned mt-0.5">{{ t("Project SettingsDeleteDesc") }}</p>
          </div>
          <UButton color="error" variant="soft" size="sm" class="shrink-0">
            {{ t("Project SettingsDelete") }}
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>
