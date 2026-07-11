<!--
学习空间页面，包含概览、知识库、笔记、收藏、学习记录等标签页。
通过 activeTabRef 控制当前显示的标签页内容。
-->
<script setup lang="ts">
definePageMeta({
  title: "Learn Space",
});

const activeTabRef = ref("overview");
</script>

<template>
  <div class="space-y-6">
    <BusinessLearnHeader :active-tab="activeTabRef" @update:active-tab="activeTabRef = $event" />

    <BusinessLearnOverviewTab v-if="activeTabRef === 'overview'" />

    <BusinessLearnKnowledgeTab v-else-if="activeTabRef === 'knowledge'" />

    <BusinessLearnNotesTab v-else-if="activeTabRef === 'notes'" />

    <BusinessLearnBookmarksTab v-else-if="activeTabRef === 'bookmarks'" />

    <BusinessLearnRecordsTab v-else-if="activeTabRef === 'records'" />
  </div>
</template>
