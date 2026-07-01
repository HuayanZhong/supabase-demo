# Heuristic — 共享包执行阶段最佳实践

## 执行前资源加载顺序

```
1. workflows/shared/{task-type}.md           → 明确执行步骤（types/i18n/lint/add-package）
2. execution-plan/shared/（3 文件）          → 明确约束/启发/策略
3. runtime/router.md 资源映射                → 确定可用 MCP/skill/rules
4. 按 workflow 资源表逐个加载引用文件        → 提前理解规则
```

一次性全部 Read 后再开始执行，避免中途频繁回头查阅。

## 类型管理最佳实践

### 新增/修改类型

```
① 搜索 packages/types/src/ 是否已有定义      避免重复
② 读取现有同类 schema 作为模式参考           保持命名和结构一致
③ 如涉及 API 响应 → 确认 API 返回数据结构    确保 schema 与实际数据匹配
④ 创建/更新 Zod v4 schema 文件
⑤ 更新 packages/types/src/index.ts re-export
⑥ 更新 packages/types/package.json exports
⑦ pnpm --filter types check-types
```

### 类型放置判断

| 场景                    | 位置                            |
| ----------------------- | ------------------------------- |
| API 请求/响应类型       | `packages/types/src/api/`       |
| 跨模块实体类型          | `packages/types/src/entities/`  |
| 通用工具类型            | `packages/types/src/common/`    |
| 两个以上模块共用        | `packages/types/` 下对应模块    |
| 单个组件/页面用到的类型 | 组件/页面文件内定义，不放共享包 |

### 跨包引用

- 跨包类型依赖（如 types 包被多个 app 引用）应在变更时记录到 `TASK_LOG` 或相关文档
- 修改共享类型前，先用 `Grep` 或 `SearchCodebase` 搜索所有消费方
- 类型变更后，优先运行 `pnpm check-types`（比 `pnpm build` 更快获得反馈）

## i18n 管理最佳实践

### 新增翻译 key

```
① 搜索现有翻译文件，确认 key 不重复
② 在全部 4 个语言文件中同步添加（zh-CN/en-US/ja-JP/ko-KR）
③ 保持 key 的嵌套结构和命名风格一致（module.key.subkey）
④ 翻译值中使用 {variable} 占位符，不拼接字符串
```

### 删除翻译 key

```
① Grep 搜索代码中是否还有对该 key 的引用
② 确认无引用后，从全部 4 个语言文件中移除
③ 更新类型定义（如有）
```

## Lint 配置最佳实践

### 修改规则

```
① Read packages/lint-config/ 下当前配置         理解现有规则集
② 分析变更对各 app 的潜在影响
③ 做精准的 SearchReplace 修改
④ 运行 pnpm lint 验证
⑤ 如需修复新报错：逐一修复而非全局 suppress
```

### 原则

- **保持现有风格** — 与现有配置文件的格式、缩进、命名风格一致
- **渐进调整** — 先在局部禁用确认无影响后再全局关闭
- **明确注释** — 在配置文件中注明规则用途和启用原因
- **优先使用项目已有工具**（oxlint），不引入新的 lint 工具

## 工具选择偏好

| 操作             | 推荐工具                      | 说明                   |
| ---------------- | ----------------------------- | ---------------------- |
| 创建新文件       | `Write`                       | 一次性写入完整内容     |
| 修改配置（少量） | `SearchReplace`               | 3 行内的精准替换       |
| 修改配置（大量） | 分段 `SearchReplace`          | 多处替换，每处独立操作 |
| 搜索引用方       | `Grep` / `SearchCodebase`     | 语义搜索优先           |
| 查看目录结构     | `LS`                          | 确认路径               |
| 查找文件         | `Glob`                        | 精确查找               |
| 验证类型         | `RunCommand pnpm check-types` | 最快反馈               |
| 验证 lint        | `RunCommand pnpm lint`        | 全局验证               |

## 发布顺序

1. 先改共享包（类型 / 翻译 / lint 配置）
2. 验证共享包自身构建通过
3. 再更新各 app 中的使用方
4. 全局跑一遍 `pnpm check-types` 和 `pnpm lint`
