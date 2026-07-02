<script setup lang="ts">
definePageMeta({
  title: "Project Space",
});

const { t } = useI18n();
const { currentProject, setCurrentProject } = useProjects();

const activeTab = ref("overview");

function handleSwitchProject(id: string) {
  setCurrentProject(id);
}
</script>

<template>
  <div class="space-y-6">
    <BusinessProjectsProjectHeader
      :project="currentProject"
      :active-tab="activeTab"
      @update:active-tab="activeTab = $event"
      @switch-project="handleSwitchProject"
    />

    <!-- 概览 -->
    <BusinessProjectsProjectOverviewTab v-if="activeTab === 'overview'" :project="currentProject" />

    <!-- 进展 -->
    <BusinessProjectsProjectProgressTab
      v-else-if="activeTab === 'progress'"
      :project="currentProject"
    />

    <!-- 任务 -->
    <BusinessProjectsProjectTasksTab v-else-if="activeTab === 'tasks'" :project="currentProject" />

    <!-- 文档 -->
    <BusinessProjectsProjectDocumentsTab
      v-else-if="activeTab === 'documents'"
      :project="currentProject"
    />

    <!-- AI 洞察 -->
    <BusinessProjectsProjectAiInsightsTab
      v-else-if="activeTab === 'ai'"
      :project="currentProject"
    />

    <!-- 设置 -->
    <BusinessProjectsProjectSettingsTab
      v-else-if="activeTab === 'settings'"
      :project="currentProject"
    />
  </div>
</template>
