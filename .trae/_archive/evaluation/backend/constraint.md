# Constraint — 后端评估阶段硬约束

## 评估前约束

- 开始评估前，必须先读取 `execution-engine/backend/` 了解执行约束/启发/策略
- 开始评估前，必须先读取 `workflows/backend/{task-type}.md` 的完成检查清单
- 开始评估前，必须先读取 `execution-plan/backend/` 确认规划承诺与约束
- 涉及数据库变更的任务，必须先确认 migration 文件已生成且可回滚

## 验证门禁

以下门禁**必须全部通过**：

1. **类型检查** — `pnpm check-types` 零错误
2. **代码质量** — `pnpm lint` 零 error（warning 可容忍但需记录）
3. **格式化** — `pnpm format` 无未格式化文件
4. **编译验证** — `pnpm build` 编译通过
5. **Migration 状态** — 新生成的 migration 文件必须包含 `up` 和 `down` 方法

任一门禁未通过，不得输出来完成结论。

## 完整性检查

- 计划中列出的新建文件必须真实存在
- 计划中列出的修改文件必须真实被修改
- 计划中标注的"只读"文件不得有变更
- 评估范围内（`apps/backend/`）不得存在未列入计划的新建文件
- DTO / Entity / Service / Controller / Module 注册链必须完整
- 新增 migration 必须存在对应的 Entity 变更

## 范围约束

- 评估仅对当前任务的产出负责
- 发现 API 结构变更时，记录并通知前端引用方
- 发现安全隐患（SQL 注入、敏感数据泄露）时，记录并上报路由
- 发现 schema 变更未生成 migration 时，阻断并触发 re-execute

## 回归约束

- 修改已有 API 的任务，必须回归验证下游调用方
- 修改 Entity 或 schema 的任务，必须回归验证所有关联的查询/写入逻辑
- 修改认证/授权逻辑的任务，必须回归验证所有受影响的 endpoint
- 修改 NestJS Module 注册的任务，必须验证模块依赖链未断裂

## 输出约束

- 评估结论必须包含：API endpoint 变更清单、Entity 变更清单、migration 状态
- 涉及 breaking change 的必须明确标注
- 结论：**通过** / **有条件通过** / **不通过**（附原因）
