<script setup lang="ts">
definePageMeta({
  title: "Project Space",
});

const { t } = useI18n();
const { currentProject, setCurrentProject } = useProjects();

const activeTabRef = ref("overview");

function handleSwitchProject(id: string) {
  setCurrentProject(id);
}
</script>

<template>
  <div class="space-y-6">
    <BusinessProjectsProjectHeader
      :project="currentProject"
      :active-tab="activeTabRef"
      @update:active-tab="activeTabRef = $event"
      @switch-project="handleSwitchProject"
    />

    <BusinessProjectsProjectOverviewTab
      v-if="activeTabRef === 'overview'"
      :project="currentProject"
    />

    <BusinessProjectsProjectProgressTab
      v-else-if="activeTabRef === 'progress'"
      :project="currentProject"
    />

    <BusinessProjectsProjectTasksTab
      v-else-if="activeTabRef === 'tasks'"
      :project="currentProject"
    />

    <BusinessProjectsProjectDocumentsTab
      v-else-if="activeTabRef === 'documents'"
      :project="currentProject"
    />

    <BusinessProjectsProjectAiInsightsTab
      v-else-if="activeTabRef === 'ai'"
      :project="currentProject"
    />

    <BusinessProjectsProjectSettingsTab
      v-else-if="activeTabRef === 'settings'"
      :project="currentProject"
    />
  </div>
</template>
