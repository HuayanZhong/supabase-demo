# Constraint — 共享包评估阶段硬约束

## 评估前约束

- 开始评估前，必须先读取 `execution-engine/shared/` 了解执行约束
- 开始评估前，必须先读取 `workflows/shared/{task-type}.md` 的完成检查清单
- 开始评估前，必须先读取 `execution-plan/shared/` 确认规划承诺

## 验证门禁

1. **类型检查** — `pnpm check-types` 零错误（所有引用方）
2. **代码质量** — `pnpm lint` 零 error
3. **格式化** — `pnpm format` 无未格式化文件
4. **编译验证** — `pnpm build` 通过（如适用）

## 完整性检查

- 新增类型必须确认已从包入口（`index.ts`）导出
- 4 语言翻译文件（`zh-CN`/`en`/`ja`/`ko`）必须同时更新并保持结构一致
- 新增翻译 key 必须遵循命名约定（模块.功能.描述）
- 翻译 key 在整个项目中不得重复（自动检测冲突）
- 新增 lint 规则必须确认与现有规则不冲突

## 范围约束

- 类型变更涉及 breaking change 的必须标注
- 翻译 key 变更涉及前端引用的，必须记录移交
- 新增 lint 规则不得导致现有大量代码报错（如需修复，应纳入任务范围）

## 输出约束

- 涉及 types 的评估报告包含：新增类型清单、导出确认、breaking change 标注
- 涉及 i18n 的评估报告包含：新增 key 清单、语言覆盖度（必须 4/4 全）
- 涉及 lint 的评估报告包含：新增规则清单、冲突检查结果
