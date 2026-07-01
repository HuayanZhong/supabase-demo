# Heuristic — 后端评估阶段最佳实践

## 评估前加载顺序

```
1. workflows/backend/{task-type}.md 完成检查清单  → 明确评估基准
2. execution-plan/backend/（3 文件）              → 明确规划承诺
3. execution-engine/backend/（3 文件）            → 明确执行记录
4. 读取实际产出文件                                → 对比预期
```

## 评估流程

### 新建 API（create）

```
① 文件完整检查        → DTO/Entity/Service/Controller/Module 全部创建
② 模块注册检查        → 新模块是否在父模块的 imports 中注册
③ 类型检查            → pnpm check-types
④ 代码质量            → pnpm lint
⑤ API 路径一致性      → Controller 路径与模块命名一致
⑥ 多余文件检查        → apps/backend/ 范围无未列入计划的文件
```

### 修改功能（modify）

```
① 确认修改点          → 计划修改的文件是否确实被修改
② 只读文件验证        → 计划外文件是否被误改
③ 类型检查            → pnpm check-types
④ 回归验证            → 下游调用方是否正常工作
⑤ 多余文件检查        → apps/backend/ 范围无未列入计划的文件
```

### 修复 Bug（fix）

```
① 确认 Bug 不再复现   → 按原复现步骤操作
② 修改范围验证        → 是否只改问题区域
③ 类型检查            → pnpm check-types
④ 回归验证            → 关联功能是否正常
⑤ 注释检查            → 非显而易见逻辑是否有注释说明
⑥ 多余文件检查        → apps/backend/ 范围无未列入计划的文件
```

### 重构（refactor）

```
① 新文件确认          → 按计划创建了哪些文件
② 旧文件确认          → 旧代码是否迁移干净，无残留引用
③ 类型检查            → pnpm check-types
④ 引用更新验证        → 所有引用方已更新导入路径
⑤ 多余文件检查        → apps/backend/ 范围无未列入计划的文件
```

### API 调整（api）

```
① endpoint 变更确认   → 路径/方法/参数/响应结构是否按计划修改
② 版本兼容性检查      → breaking change 是否已做版本处理
③ 类型检查            → pnpm check-types
④ 回归验证            → 所有调用方已更新
⑤ 多余文件检查        → apps/backend/ 范围无未列入计划的文件
```

### 数据变更（data）

```
① migration 文件检查    → up 和 down 方法完整
② Entity 同步验证       → Entity 变更与 migration 对应
③ 数据完整性检查        → 外键/索引/唯一约束明确
④ 类型检查              → pnpm check-types
⑤ 回归验证              → 关联查询是否正常工作
⑥ 多余文件检查          → apps/backend/ 范围无未列入计划的文件
```

## 验证命令执行顺序

```
pnpm check-types    → 类型零错误（阻断性）
pnpm lint           → error 零（非阻断性可容忍但记录）
pnpm format         → 无未格式化文件
pnpm build          → 编译通过（如适用）
```

## 回归范围建议

| 变更类型           | 建议回归范围                            |
| ------------------ | --------------------------------------- |
| 修改 DTO/Entity    | 搜索该 DTO/Entity 的所有引用            |
| 修改 Service       | 搜索该 Service 的所有 Controller 调用方 |
| 修改 API 路径/方法 | 搜索前端所有调用该 API 的代码           |
| 修改 Module 注册   | 验证模块依赖链完整性                    |
| 新增 migration     | 验证迁移 up/down 可正常执行             |
