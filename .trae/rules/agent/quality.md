---
alwaysApply: false
description: 质量验证规范，Stop 时注入
---

# 质量验证

## 结果质量校验

任务完成后，主智能体执行以下检查：

| 检查项         | 检查方法                                          | 通过标准                                       |
| -------------- | ------------------------------------------------- | ---------------------------------------------- |
| 逻辑一致性     | 检查变更是否前后矛盾                              | 无矛盾逻辑                                     |
| 数据准确性     | 确认类型、API 参数、配置路径无误                  | 与现有文档/MCP 查询结果一致                    |
| 格式规范性     | 检查是否符合项目命名/文件结构规范（按 naming.md） | 无不符合项                                     |
| 用户需求匹配   | 对比用户原始请求和最终输出                        | 所有需求已覆盖                                 |
| Agent 选型合规 | 对比 routing.md 推荐 Agent 与实际执行的 Agent     | 用推荐 Agent 或已在日志中注明降级原因          |
| 编译/类型安全  | 运行 `pnpm -F {包名} check-types`                 | 无类型错误                                     |
| 代码规范检查   | 运行 `pnpm -F {包名} lint`（如项目配置了 lint）   | 无 lint 错误；如未配置 lint 则标注"未配置"原因 |
| 已有功能未破坏 | 检查是否有静默移除已有行为                        | 未被要求的代码段未删除                         |

## 规则检查清单

修改代码前，必须列出该文件涉及的所有领域规则文件，逐条检查关键条款：

| 文件类型           | 必须检查的规则文件                                                                   |
| ------------------ | ------------------------------------------------------------------------------------ |
| Vue 组件/页面      | `frontend/nuxt.md` `frontend/styles.md` `frontend/comments.md`                       |
| Server route       | `frontend/nuxt.md`（数据获取、server routes 规范）                                   |
| Backend Service    | `backend/nestjs.md` `backend/database.md` `backend/comments.md` `backend/logging.md` |
| Backend Controller | `backend/nestjs.md` `backend/error-handling.md`                                      |
| 类型定义           | `shared/frontend-types.md`                                                           |

检查完成后，在输出中声明："已检查 {N} 个规则文件，关键条款均已遵守"。
