<script setup lang="ts">
definePageMeta({
  title: "Learn Space",
});

const activeTab = ref("overview");
</script>

<template>
  <div class="space-y-6">
    <BusinessLearnLearnHeader :active-tab="activeTab" @update:active-tab="activeTab = $event" />

    <!-- 概览 -->
    <BusinessLearnLearnOverviewTab v-if="activeTab === 'overview'" />

    <!-- 知识库 -->
    <BusinessLearnLearnKnowledgeTab v-else-if="activeTab === 'knowledge'" />

    <!-- 笔记 -->
    <BusinessLearnLearnNotesTab v-else-if="activeTab === 'notes'" />

    <!-- 收藏 -->
    <BusinessLearnLearnBookmarksTab v-else-if="activeTab === 'bookmarks'" />

    <!-- 学习记录 -->
    <BusinessLearnLearnRecordsTab v-else-if="activeTab === 'records'" />
  </div>
</template>
