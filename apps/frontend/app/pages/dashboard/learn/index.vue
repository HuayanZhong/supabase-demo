<script setup lang="ts">
definePageMeta({
  title: "Learn Space",
});

const activeTab = ref("overview");
</script>

<template>
  <div class="space-y-6">
    <BusinessLearnHeader :active-tab="activeTab" @update:active-tab="activeTab = $event" />

    <!-- 概览 -->
    <BusinessLearnOverviewTab v-if="activeTab === 'overview'" />

    <!-- 知识库 -->
    <BusinessLearnKnowledgeTab v-else-if="activeTab === 'knowledge'" />

    <!-- 笔记 -->
    <BusinessLearnNotesTab v-else-if="activeTab === 'notes'" />

    <!-- 收藏 -->
    <BusinessLearnBookmarksTab v-else-if="activeTab === 'bookmarks'" />

    <!-- 学习记录 -->
    <BusinessLearnRecordsTab v-else-if="activeTab === 'records'" />
  </div>
</template>
