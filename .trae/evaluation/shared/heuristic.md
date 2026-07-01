# Heuristic — 共享包评估阶段最佳实践

## 评估前加载顺序

```
1. workflows/shared/{task-type}.md 完成检查清单  → 评估基准
2. execution-plan/shared/（3 文件）              → 规划承诺
3. execution-engine/shared/（3 文件）            → 执行记录
```

## 评估流程

### 类型管理（types）

```
① 文件完整性检查      → schema 文件是否按计划创建/修改
② 导出检查            → 包入口 index.ts 是否导出新类型
③ 引用检查            → 前端和后端是否按新类型更新
④ 类型检查            → pnpm check-types（前后端都跑一次）
⑤ Breaking change 检查 → 已有类型字段删除/重命名记录
⑥ 多余文件检查        → packages/types/ 范围无未列入计划的文件
```

### 国际化（i18n）

```
① key 完整性          → 4 语言（zh-CN/en/ja/ko）全部新增
② key 冲突检测        → 搜索整个项目无重复 key
③ 命名一致检查        → 所有新增 key 命名统一风格
④ 格式检查            → JSON 语法正确、无多行字符串
⑤ 多余文件检查        → packages/i18n/ 范围无未列入计划的文件
```

### Lint 配置（lint）

```
① 规则冲突检查        → 新增规则与现有规则不冲突
② 生效验证            → pnpm lint 在新规则下运行无大量新增 error
③ 引用检查            → 各子包 oxlint config 是否正确继承
④ 多余文件检查        → 范围无未列入计划的文件
```

### 新增包（add-package）

```
① 安装确认            → pnpm-lock.yaml 已更新
② 版本号确认          → 有明确版本号，无 * 或 latest
③ 引用验证            → 各消费方 import 路径正确
④ CVE 检查            → pnpm audit 无新增 high/critical
⑤ 多余文件检查        → 无残留的临时配置文件
```

## 验证命令执行顺序

```
搜索 key 冲突 → pnpm check-types → pnpm lint → pnpm build
```

## 翻译 key 冲突检测方式

- 用 `grep` 或 `SearchCodebase` 搜索整个项目的翻译 key 文件
- 确认新增 key 不在已有 key 列表中出现
- 如出现冲突，记录冲突 key 并触发 re-execute（重命名）
