import type {
  KnowledgeItem,
  Note,
  Bookmark,
  LearningRecord,
  LearnActivity,
  CategoryMeta,
} from "@supabase/types";

/** 模拟动态时间描述 */
function timeAgo(minutes: number): string {
  const { t } = useI18n();
  if (minutes < 1) return t("Project ActivityJustNow");
  if (minutes < 60) return t("Project ActivityMinutesAgo", { n: minutes });
  if (minutes < 1440) return t("Project ActivityHoursAgo", { n: Math.floor(minutes / 60) });
  return t("Project ActivityDaysAgo", { n: Math.floor(minutes / 1440) });
}

export function useLearn() {
  const { t } = useI18n();

  // 分类元数据
  const categoryMeta: Record<string, CategoryMeta> = {
    frontend: { icon: "i-lucide-code-2", color: "primary", label: t("Learn CategoryFrontend") },
    backend: { icon: "i-lucide-server", color: "success", label: t("Learn CategoryBackend") },
    design: { icon: "i-lucide-palette", color: "warning", label: t("Learn CategoryDesign") },
    devops: { icon: "i-lucide-container", color: "info", label: t("Learn CategoryDevops") },
    ai: { icon: "i-lucide-sparkles", color: "error", label: t("Learn CategoryAI") },
    general: { icon: "i-lucide-book-open", color: "neutral", label: t("Learn CategoryGeneral") },
  };

  // 知识库条目
  const knowledgeItems: KnowledgeItem[] = [
    {
      id: "k1",
      title: "Nuxt 3 组合式 API 最佳实践",
      summary: "深入探讨 Nuxt 3 中 useAsyncData、useFetch 和 useState 的使用场景与最佳实践",
      category: "frontend",
      tags: ["Nuxt", "Vue", "Composables"],
      author: "张三",
      status: "published",
      viewCount: 1280,
      updatedAt: "2 天前",
    },
    {
      id: "k2",
      title: "Supabase RLS 权限策略设计指南",
      summary: "详细介绍 Row Level Security 的配置方式及常见安全策略模板",
      category: "backend",
      tags: ["Supabase", "安全", "PostgreSQL"],
      author: "李四",
      status: "published",
      viewCount: 856,
      updatedAt: "5 天前",
    },
    {
      id: "k3",
      title: "Tailwind CSS v4 迁移指南",
      summary: "从 v3 迁移到 v4 的完整步骤，含 CSS-first 配置与兼容性说明",
      category: "frontend",
      tags: ["Tailwind", "CSS"],
      author: "张三",
      status: "published",
      viewCount: 2340,
      updatedAt: "1 周前",
    },
    {
      id: "k4",
      title: "微服务架构设计模式概览",
      summary: "梳理常见的微服务架构模式：API Gateway、CQRS、Saga 等",
      category: "backend",
      tags: ["架构", "微服务"],
      author: "王五",
      status: "draft",
      viewCount: 0,
      updatedAt: "3 天前",
    },
    {
      id: "k5",
      title: "Figma 设计 Token 自动化工作流",
      summary: "利用 Figma API + Style Dictionary 实现设计 Token 的自动同步",
      category: "design",
      tags: ["Figma", "Design Token", "自动化"],
      author: "赵六",
      status: "published",
      viewCount: 645,
      updatedAt: "1 周前",
    },
    {
      id: "k6",
      title: "Docker 容器化部署实战",
      summary: "从 Dockerfile 编写到多阶段构建，再到 Compose 编排的完整实战",
      category: "devops",
      tags: ["Docker", "CI/CD"],
      author: "王五",
      status: "published",
      viewCount: 1820,
      updatedAt: "2 周前",
    },
    {
      id: "k7",
      title: "LLM 应用开发入门：Prompt 工程与 RAG",
      summary: "探讨大语言模型应用开发的核心技术：提示词工程与检索增强生成",
      category: "ai",
      tags: ["LLM", "RAG", "Prompt"],
      author: "张三",
      status: "published",
      viewCount: 3100,
      updatedAt: "3 天前",
    },
  ];

  // 笔记
  const notes: Note[] = [
    {
      id: "n1",
      title: "Nuxt UI v4 组件踩坑记录",
      content: "UDashboardGroup 的 sidebar 默认宽度和响应式行为需要设置 collapsible...",
      category: "frontend",
      tags: ["Nuxt", "UI"],
      isPinned: true,
      createdAt: "2026-06-28",
      updatedAt: "2026-07-01",
    },
    {
      id: "n2",
      title: "PostgreSQL 索引优化思路",
      content: "对于经常查询的字段建议使用 B-tree 索引，全文搜索用 GIN 索引...",
      category: "backend",
      tags: ["PostgreSQL", "性能"],
      isPinned: false,
      createdAt: "2026-06-25",
      updatedAt: "2026-06-30",
    },
    {
      id: "n3",
      title: "本周学习计划",
      content: "1. 完成 NestJS 认证模块 2. 阅读 Clean Architecture 第 5 章 3. 实践 Docker Compose",
      category: "general",
      tags: ["计划"],
      isPinned: true,
      createdAt: "2026-06-30",
      updatedAt: "2026-06-30",
    },
    {
      id: "n4",
      title: "Vue 响应式原理深入",
      content:
        "Vue 3 使用 Proxy 替代 Object.defineProperty，解决了数组索引和属性增删的响应式问题...",
      category: "frontend",
      tags: ["Vue", "原理"],
      isPinned: false,
      createdAt: "2026-06-20",
      updatedAt: "2026-06-22",
    },
    {
      id: "n5",
      title: "Git 工作流规范",
      content: "采用 trunk-based development：feature branch → PR review → squash merge → main",
      category: "devops",
      tags: ["Git", "协作"],
      isPinned: false,
      createdAt: "2026-06-15",
      updatedAt: "2026-06-18",
    },
  ];

  // 收藏
  const bookmarks: Bookmark[] = [
    {
      id: "b1",
      title: "Nuxt 4 路线图与 RFC",
      url: "https://github.com/nuxt/nuxt/discussions",
      description: "Nuxt 官方发布的 v4 路线图和 RFC 讨论",
      source: "github",
      tags: ["Nuxt", "前端"],
      savedAt: "2026-07-01",
    },
    {
      id: "b2",
      title: "为什么说 90% 的 RLS 策略都配错了",
      url: "https://example.com/supabase-rls-guide",
      description: "深度解析 Supabase RLS 常见配置错误和最佳实践",
      source: "article",
      tags: ["Supabase", "安全"],
      savedAt: "2026-06-28",
    },
    {
      id: "b3",
      title: "Vite 插件开发完全指南",
      url: "https://example.com/vite-plugin-guide",
      description: "从零开始编写 Vite 插件，覆盖开发、测试到发布全流程",
      source: "article",
      tags: ["Vite", "前端工具"],
      savedAt: "2026-06-25",
    },
    {
      id: "b4",
      title: "nest-vue-admin 开源后台模板",
      url: "https://github.com/example/nest-vue-admin",
      description: "基于 NestJS + Vue 3 的全栈后台管理模板",
      source: "github",
      tags: ["NestJS", "Vue", "模板"],
      savedAt: "2026-06-20",
    },
    {
      id: "b5",
      title: "Node.js 性能优化实战分享",
      url: "https://www.youtube.com/watch?v=example",
      description: "来自字节跳动的 Node.js 性能优化实践经验分享",
      source: "video",
      tags: ["Node.js", "性能"],
      savedAt: "2026-06-18",
    },
    {
      id: "b6",
      title: "CSS Container Queries 完全指南",
      url: "https://example.com/css-container-queries",
      description: "详解 CSS Container Queries 的语法、用例和浏览器兼容性",
      source: "article",
      tags: ["CSS", "响应式"],
      savedAt: "2026-06-15",
    },
    {
      id: "b7",
      title: "Tailwind CSS 官方文档",
      url: "https://tailwindcss.com/docs",
      description: "Tailwind CSS 官方文档，随时查阅",
      source: "external",
      tags: ["Tailwind", "文档"],
      savedAt: "2026-06-10",
    },
  ];

  // 学习记录
  const learningRecords: LearningRecord[] = [
    {
      id: "r1",
      topic: "Nuxt 3 服务端渲染原理",
      category: "frontend",
      duration: 120,
      date: "2026-07-01",
      summary: "深入学习了 Nuxt 3 的 SSR 渲染流程和 Nitro 引擎架构",
      source: "官方文档 + 实践",
    },
    {
      id: "r2",
      topic: "Supabase Edge Functions 开发",
      category: "backend",
      duration: 90,
      date: "2026-06-30",
      summary: "学习了 Deno 运行时下 Edge Functions 的开发和部署流程",
      source: "Supabase 官方教程",
    },
    {
      id: "r3",
      topic: "设计系统构建方法论",
      category: "design",
      duration: 60,
      date: "2026-06-28",
      summary: "学习 Atomic Design 方法论和 Design Token 体系构建",
      source: "在线课程",
    },
    {
      id: "r4",
      topic: "RAG 检索增强生成技术",
      category: "ai",
      duration: 150,
      date: "2026-06-25",
      summary: "学习了向量数据库选型、文档切分策略和检索排序算法",
      source: "论文 + 实践项目",
    },
    {
      id: "r5",
      topic: "Docker 多阶段构建优化",
      category: "devops",
      duration: 45,
      date: "2026-06-22",
      summary: "实践了多阶段构建减少镜像体积的方案，效果显著",
      source: "Docker 官方文档",
    },
    {
      id: "r6",
      topic: "TypeScript 高级类型体操",
      category: "frontend",
      duration: 100,
      date: "2026-06-20",
      summary: "掌握了条件类型、模板字面量类型和 infer 关键字的使用",
      source: "TypeScript 官方 Handbook",
    },
    {
      id: "r7",
      topic: "Redis 缓存策略设计",
      category: "backend",
      duration: 80,
      date: "2026-06-18",
      summary: "学习了缓存穿透、击穿、雪崩的解决方案和常见的缓存更新策略",
      source: "技术博客 + 实践",
    },
  ];

  // 近期动态
  const recentActivities: LearnActivity[] = [
    {
      id: "la1",
      type: "knowledge_created",
      content: "LLM 应用开发入门：Prompt 工程与 RAG",
      user: "张三",
      timestamp: timeAgo(120),
    },
    {
      id: "la2",
      type: "learning_completed",
      content: "Nuxt 3 服务端渲染原理",
      user: "张三",
      timestamp: timeAgo(300),
    },
    {
      id: "la3",
      type: "note_created",
      content: "Nuxt UI v4 组件踩坑记录",
      user: "张三",
      timestamp: timeAgo(480),
    },
    {
      id: "la4",
      type: "bookmark_saved",
      content: "Nuxt 4 路线图与 RFC",
      user: "李四",
      timestamp: timeAgo(720),
    },
    {
      id: "la5",
      type: "knowledge_created",
      content: "微服务架构设计模式概览",
      user: "王五",
      timestamp: timeAgo(1440),
    },
    {
      id: "la6",
      type: "learning_completed",
      content: "设计系统构建方法论",
      user: "赵六",
      timestamp: timeAgo(1800),
    },
  ];

  // 统计数据
  const stats = computed(() => ({
    knowledgeCount: knowledgeItems.filter((k) => k.status === "published").length,
    noteCount: notes.length,
    bookmarkCount: bookmarks.length,
    monthlyHours: learningRecords.reduce((sum, r) => sum + r.duration, 0) / 60,
    recordCount: learningRecords.length,
  }));

  // 本周各天学习时长趋势（模拟数据）
  const weeklyTrend = [
    { day: t("Weekday Mon"), minutes: 90 },
    { day: t("Weekday Tue"), minutes: 120 },
    { day: t("Weekday Wed"), minutes: 60 },
    { day: t("Weekday Thu"), minutes: 150 },
    { day: t("Weekday Fri"), minutes: 80 },
    { day: t("Weekday Sat"), minutes: 180 },
    { day: t("Weekday Sun"), minutes: 45 },
  ];

  // 分类分布统计
  const categoryDistribution = computed(() => {
    const map: Record<string, number> = {};
    for (const k of knowledgeItems) {
      map[k.category] = (map[k.category] || 0) + 1;
    }
    return Object.entries(map)
      .map(([key, count]) => ({
        category: key,
        count,
        meta: categoryMeta[key]!,
      }))
      .toSorted((a, b) => b.count - a.count);
  });

  return {
    categoryMeta,
    knowledgeItems,
    notes,
    bookmarks,
    learningRecords,
    recentActivities,
    stats,
    weeklyTrend,
    categoryDistribution,
  };
}
