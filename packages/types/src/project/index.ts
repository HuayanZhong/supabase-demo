// 项目相关类型定义

export type ActivityType =
  | "task_completed"
  | "comment_added"
  | "file_uploaded"
  | "task_created"
  | "milestone_reached";

export interface ProjectActivity {
  id: string;
  type: ActivityType;
  content: string;
  user: string;
  timestamp: string;
}

export interface ProjectMilestone {
  id: string;
  name: string;
  description: string;
  deadline: string;
  status: "pending" | "in_progress" | "completed";
}

export type DocumentType = "doc" | "sheet" | "figma" | "markdown";

export interface ProjectDocument {
  id: string;
  name: string;
  type: DocumentType;
  updatedAt: string;
  updatedBy: string;
}

export type TaskPriority = "high" | "medium" | "low";
export type TaskStatus = "todo" | "doing" | "done";

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
