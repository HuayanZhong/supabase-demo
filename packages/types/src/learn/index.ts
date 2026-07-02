// 学习与资料相关类型定义

// 知识库条目的分类
export type KnowledgeCategory = "frontend" | "backend" | "design" | "devops" | "ai" | "general";

// 知识库条目状态
export type KnowledgeStatus = "draft" | "published" | "archived";

// 知识库条目
export interface KnowledgeItem {
  id: string;
  title: string;
  summary: string;
  category: KnowledgeCategory;
  tags: string[];
  author: string;
  status: KnowledgeStatus;
  viewCount: number;
  updatedAt: string;
}

// 笔记
export interface Note {
  id: string;
  title: string;
  content: string;
  category: KnowledgeCategory;
  tags: string[];
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

// 收藏项来源类型
export type BookmarkSource = "internal" | "external" | "github" | "article" | "video";

// 收藏项
export interface Bookmark {
  id: string;
  title: string;
  url: string;
  description: string;
  source: BookmarkSource;
  tags: string[];
  savedAt: string;
}

// 学习记录
export interface LearningRecord {
  id: string;
  topic: string;
  category: KnowledgeCategory;
  duration: number; // 分钟
  date: string;
  summary: string;
  source: string;
}

// 近期学习动态
export type LearnActivityType =
  | "knowledge_created"
  | "note_created"
  | "bookmark_saved"
  | "learning_completed";

export interface LearnActivity {
  id: string;
  type: LearnActivityType;
  content: string;
  user: string;
  timestamp: string;
}

// 分类元数据（图标 + 颜色 + 标签）
export interface CategoryMeta {
  icon: string;
  color: "primary" | "success" | "info" | "warning" | "error" | "neutral";
  label: string;
}
