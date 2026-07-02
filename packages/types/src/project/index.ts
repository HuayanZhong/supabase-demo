// 项目相关类型定义

// 动态类型：不同操作对应不同图标和文案
export type ActivityType =
  | "task_completed"
  | "comment_added"
  | "file_uploaded"
  | "task_created"
  | "milestone_reached";

// 近期动态条目，timestamp 用相对时间描述（"2 小时前"）而非绝对时间
export interface ProjectActivity {
  id: string;
  type: ActivityType;
  content: string;
  user: string;
  timestamp: string;
}

// 里程碑，用于进展 Tab 的时间线展示
export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
}

export type DocumentType = "doc" | "sheet" | "figma" | "markdown";

// 文档/文件条目，type 决定图标渲染
export interface ProjectDocument {
  id: string;
  name: string;
  type: DocumentType;
  updatedAt: string;
  updatedBy: string;
}

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "doing" | "done";

// 项目空间中的任务条目，独立于看板视图的任务模型
export interface ProjectTask {
  id: string;
  name: string;
  assignee: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
}

export type ProjectStatus = "active" | "archived";
export type ProjectHealth = "healthy" | "warning" | "danger";
export type ProjectColor = "success" | "info" | "warning" | "primary";

// 项目空间核心模型，整合了概览/进展/任务/文档等 Tab 所需数据
// 与 GoalListCard 的静态数据结构保持兼容，后续可统一数据源
export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  progress: number;
  health: ProjectHealth;
  members: number;
  tasks: { done: number; total: number };
  tags: string[];
  icon: string;
  color: ProjectColor;
  recentActivities: ProjectActivity[];
  milestones: ProjectMilestone[];
  documents: ProjectDocument[];
  taskList: ProjectTask[];
}
