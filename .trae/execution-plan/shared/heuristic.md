# Heuristic — 共享包规划最佳实践

## Agent 映射

| 任务类型    | 执行 Agent         | 关注重点                           |
| ----------- | ------------------ | ---------------------------------- |
| types       | backend-architect  | Zod v4 schema、类型兼容、exports   |
| i18n        | frontend-architect | 4 语言同步、key 命名约定           |
| lint        | backend-architect  | oxlint 规则、项目一致性            |
| add-package | backend-architect  | 包结构、exports 路径、package.json |

## 扫描先手

1. 新增类型前，先搜索 `packages/types/src/` 中是否已有定义
2. 新增翻译 key 前，先搜索现有翻译文件中是否有相同文案
3. lint 配置变更前，先读当前配置理解现有规则

## 类型管理

| 场景              | 位置                           |
| ----------------- | ------------------------------ |
| API 请求/响应类型 | `packages/types/src/api/`      |
| 跨模块实体类型    | `packages/types/src/entities/` |
| 通用工具类型      | `packages/types/src/common/`   |
| 局部组件内类型    | 组件文件内定义，不放共享包     |

## i18n 管理

- 翻译 key 按功能模块分组：`module.key.subkey`
- 新增 key 时保持与同类 key 的命名风格一致
- 翻译值中使用 `{variable}` 占位符，不拼接字符串

## 版本管理

- 共享包变更建议标注版本号（在 `package.json` 中递增）
- 破坏性变更必须升主版本号
- 所有 app 使用同一版本，不出现版本分裂

## 发布顺序

1. 先改共享包（类型 / 翻译 / lint 配置）
2. 验证共享包自身构建通过
3. 再更新各 app 中的使用方
4. 全局跑一遍 `pnpm check-types` 和 `pnpm lint`
