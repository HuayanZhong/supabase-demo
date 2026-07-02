import type { Project, ProjectHealth, ProjectActivity } from "@supabase/types";

/** 模拟动态时间描述 */
function timeAgo(minutes: number): string {
  const { t } = useI18n();
  if (minutes < 1) return t("Project ActivityJustNow");
  if (minutes < 60) return t("Project ActivityMinutesAgo", { n: minutes });
  if (minutes < 1440) return t("Project ActivityHoursAgo", { n: Math.floor(minutes / 60) });
  return t("Project ActivityDaysAgo", { n: Math.floor(minutes / 1440) });
}

const mockActivities = (projectId: string): ProjectActivity[] => {
  const activities: Record<string, ProjectActivity[]> = {
    "p-1": [
      {
        id: "a1",
        type: "task_completed",
        content: "用户认证流程",
        user: "张三",
        timestamp: timeAgo(5),
      },
      {
        id: "a2",
        type: "comment_added",
        content: "API 接口设计文档",
        user: "李四",
        timestamp: timeAgo(30),
      },
      {
        id: "a3",
        type: "file_uploaded",
        content: "数据库 ER 图 v3",
        user: "张三",
        timestamp: timeAgo(120),
      },
      {
        id: "a4",
        type: "milestone_reached",
        content: "MVP 版本发布",
        user: "王五",
        timestamp: timeAgo(300),
      },
      {
        id: "a5",
        type: "task_created",
        content: "性能优化方案评审",
        user: "李四",
        timestamp: timeAgo(600),
      },
    ],
    "p-2": [
      {
        id: "a6",
        type: "file_uploaded",
        content: "设计规范 v2.0",
        user: "赵六",
        timestamp: timeAgo(10),
      },
      {
        id: "a7",
        type: "task_completed",
        content: "色彩系统重构",
        user: "赵六",
        timestamp: timeAgo(60),
      },
      {
        id: "a8",
        type: "comment_added",
        content: "组件库文档",
        user: "张三",
        timestamp: timeAgo(180),
      },
    ],
  };
  return activities[projectId] ?? [];
};

export function useProjects() {
  const { t } = useI18n();

  const projects: Project[] = [
    {
      id: "p-1",
      name: t("Goal GrowthOs"),
      description: t("Goal GrowthOsDesc"),
      status: "active",
      progress: 68,
      health: "healthy",
      members: 3,
      tasks: { done: 12, total: 18 },
      tags: [t("Tag Frontend"), t("Tag Nuxt")],
      icon: "i-lucide-sprout",
      color: "success",
      recentActivities: mockActivities("p-1"),
      milestones: [
        {
          id: "m1",
          name: "需求分析",
          description: "完成用户需求调研和功能规划",
          deadline: "2026-06-15",
          status: "completed",
        },
        {
          id: "m2",
          name: "原型设计",
          description: "高保真原型和交互设计",
          deadline: "2026-07-01",
          status: "completed",
        },
        {
          id: "m3",
          name: "核心开发",
          description: "主要功能模块开发",
          deadline: "2026-08-15",
          status: "in_progress",
        },
        {
          id: "m4",
          name: "测试上线",
          description: "集成测试和生产环境部署",
          deadline: "2026-09-01",
          status: "pending",
        },
      ],
      documents: [
        { id: "d1", name: "产品需求文档", type: "doc", updatedAt: "2 小时前", updatedBy: "张三" },
        {
          id: "d2",
          name: "API 接口规范",
          type: "markdown",
          updatedAt: "1 天前",
          updatedBy: "李四",
        },
        { id: "d3", name: "数据库设计", type: "sheet", updatedAt: "3 天前", updatedBy: "王五" },
        { id: "d4", name: "交互原型", type: "figma", updatedAt: "5 天前", updatedBy: "赵六" },
      ],
      taskList: [
        {
          id: "t1",
          name: "实现 JWT 认证中间件",
          assignee: "张三",
          priority: "high",
          status: "doing",
          deadline: "2026-07-10",
        },
        {
          id: "t2",
          name: "设计数据库表结构",
          assignee: "李四",
          priority: "high",
          status: "done",
          deadline: "2026-07-05",
        },
        {
          id: "t3",
          name: "编写单元测试",
          assignee: "张三",
          priority: "medium",
          status: "todo",
          deadline: "2026-07-15",
        },
        {
          id: "t4",
          name: "配置 CI/CD 流水线",
          assignee: "王五",
          priority: "medium",
          status: "doing",
          deadline: "2026-07-12",
        },
        {
          id: "t5",
          name: "前端页面性能优化",
          assignee: "李四",
          priority: "low",
          status: "todo",
          deadline: "2026-07-20",
        },
      ],
    },
    {
      id: "p-2",
      name: t("Goal DesignSystem"),
      description: t("Goal DesignSystemDesc"),
      status: "active",
      progress: 45,
      health: "warning",
      members: 2,
      tasks: { done: 9, total: 20 },
      tags: [t("Tag Design"), t("Tag Figma")],
      icon: "i-lucide-palette",
      color: "info",
      recentActivities: mockActivities("p-2"),
      milestones: [
        {
          id: "m5",
          name: "设计审计",
          description: "现有组件盘点与风格统一",
          deadline: "2026-06-20",
          status: "completed",
        },
        {
          id: "m6",
          name: "基础组件库",
          description: "按钮、表单、导航等基础组件",
          deadline: "2026-07-30",
          status: "in_progress",
        },
        {
          id: "m7",
          name: "文档站搭建",
          description: "Storybook 和文档编写",
          deadline: "2026-08-20",
          status: "pending",
        },
      ],
      documents: [
        { id: "d5", name: "设计规范手册", type: "doc", updatedAt: "1 天前", updatedBy: "赵六" },
        {
          id: "d6",
          name: "组件使用指南",
          type: "markdown",
          updatedAt: "2 天前",
          updatedBy: "赵六",
        },
      ],
      taskList: [
        {
          id: "t6",
          name: "Button 组件重构",
          assignee: "赵六",
          priority: "high",
          status: "doing",
          deadline: "2026-07-08",
        },
        {
          id: "t7",
          name: "颜色 Token 定义",
          assignee: "赵六",
          priority: "high",
          status: "done",
          deadline: "2026-07-03",
        },
        {
          id: "t8",
          name: "Form 组件开发",
          assignee: "张三",
          priority: "medium",
          status: "todo",
          deadline: "2026-07-18",
        },
      ],
    },
    {
      id: "p-3",
      name: t("Goal ApiPlatform"),
      description: t("Goal ApiPlatformDesc"),
      status: "active",
      progress: 82,
      health: "healthy",
      members: 4,
      tasks: { done: 33, total: 40 },
      tags: [t("Tag Backend"), t("Tag Supabase")],
      icon: "i-lucide-server",
      color: "warning",
      recentActivities: [],
      milestones: [
        {
          id: "m8",
          name: "架构设计",
          description: "系统架构和技术选型",
          deadline: "2026-05-01",
          status: "completed",
        },
        {
          id: "m9",
          name: "核心 API 开发",
          description: "RESTful API 开发",
          deadline: "2026-06-15",
          status: "completed",
        },
        {
          id: "m10",
          name: "性能压测",
          description: "负载测试和性能优化",
          deadline: "2026-07-10",
          status: "in_progress",
        },
        {
          id: "m11",
          name: "文档生成",
          description: "API 文档自动生成",
          deadline: "2026-07-20",
          status: "pending",
        },
      ],
      documents: [
        { id: "d7", name: "架构设计文档", type: "doc", updatedAt: "1 周前", updatedBy: "王五" },
        { id: "d8", name: "API 路由表", type: "sheet", updatedAt: "3 天前", updatedBy: "李四" },
      ],
      taskList: [
        {
          id: "t9",
          name: "用户服务重构",
          assignee: "王五",
          priority: "high",
          status: "doing",
          deadline: "2026-07-10",
        },
        {
          id: "t10",
          name: "Rate Limiter 实现",
          assignee: "李四",
          priority: "medium",
          status: "doing",
          deadline: "2026-07-12",
        },
        {
          id: "t11",
          name: "Swagger 文档完善",
          assignee: "张三",
          priority: "low",
          status: "todo",
          deadline: "2026-07-20",
        },
      ],
    },
  ];

  const currentProjectId = ref<string>(projects[0]!.id);

  const currentProject = computed((): Project => {
    return projects.find((p) => p.id === currentProjectId.value) ?? projects[0]!;
  });

  function setCurrentProject(id: string) {
    currentProjectId.value = id;
  }

  const healthMeta: Record<
    ProjectHealth,
    { color: "success" | "warning" | "error" | "neutral"; label: string }
  > = {
    healthy: { color: "success", label: t("Project Healthy") },
    warning: { color: "warning", label: t("Project Warning") },
    danger: { color: "error", label: t("Project Danger") },
  };

  return {
    projects,
    currentProjectId,
    currentProject,
    setCurrentProject,
    healthMeta,
  };
}
