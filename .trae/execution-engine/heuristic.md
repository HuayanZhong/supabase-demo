# Heuristic — 执行阶段通用最佳实践

## 执行前加载顺序

```
1. workflows/{domain}/{task-type}.md     → 明确执行步骤
2. execution-plan/{domain}/（3 文件）    → 明确约束/启发/策略
3. runtime/{domain}/router.md 资源映射   → 确定可用 MCP/skill/rules
4. 按 workflow 资源表逐个加载引用文件    → 提前理解规则
```

一次性全部 Read 后再开始执行，避免中途频繁回头查阅。

## 依赖链执行模式

多领域任务按总路由分发的依赖链执行：

```
Step 1 subagent 执行完毕 →
  输出 context JSON（summary/outputs/affected_files/notes） →
Step 2 subagent 读取 context →
  理解上一步输出后再执行自己的部分
```

每步 subagent 只关注自己的领域，不猜测上一步和下一步的内容。

## 工具选择优先级

| 操作             | 优先工具             | 说明               |
| ---------------- | -------------------- | ------------------ |
| 读文件           | `Read`               | 先读再改           |
| 写新文件         | `Write`              | 一次性写入         |
| 修改少量代码     | `SearchReplace`      | 3 行内的精准替换   |
| 修改多处分散代码 | 多次 `SearchReplace` | 每次只改一个逻辑点 |
| 查找文件         | `Glob`               | 按文件名模式       |
| 搜索代码内容     | `Grep`               | 按文本/正则        |
| 语义搜索         | `SearchCodebase`     | 按意图/行为        |
| 运行命令         | `RunCommand`         | 构建/测试/格式化   |
| 查目录结构       | `LS`                 | 确认路径           |

## 分步执行习惯

每执行一步之前和之后，输出执行日志（日志格式标准见 `../logging.md`）：

```
[ENGINE:start]    START  | 开始执行               | domain=领域;type=任务类型
[ENGINE:step]     OK/FAIL | 当前步骤描述          | file=文件名;operation=新建/修改/删除
[ENGINE:tool]     OK/FAIL | 工具调用描述           | tool=工具名;action=操作;result=结果
[ENGINE:done]     END    | 执行完成               | files=N;tools=N;errors=N
```

复杂任务分步执行，每步只做一件事

- 每步完成后用 `pnpm check-types` 或等价命令验证
- 验证通过后再进入下一步
- 不急于一次性完成所有内容

## 错误预防

- 修改前先 Read，确认当前行号范围
- 文件名含空格时用引号包裹
- 涉及路径操作时使用绝对路径
- 多条命令建议用 `&&` 连接（一条失败则停止）
- Windows 路径使用反斜杠

## 输出整理

执行完成后输出结构化摘要：

```
## 执行摘要

- 修改了哪些文件（路径 + 操作类型：新建/修改/删除）
- 每项变更的简要说明
- 验证结果（类型检查 / lint / format 是否通过）
- 遗留问题（如有）
- 影响范围（哪些模块/功能会受影响）
```

## 完成后触发评估

执行完毕并输出摘要后，**必须触发以下后续流程**：

1. **调用 evaluation** — 读取 `evaluation/{domain}/` 下的约束/启发式/策略，执行质量门禁检查
2. **输出评估报告** — 按 evaluation/heuristic.md 通用评估流程执行 ①→⑦
3. **写入经验数据** — 按 evolution/heuristic.md ① 数据收集规范，将本次执行的经验写入 `.trae/experience/`
4. 如任务属于依赖链的一部分，将执行摘要作为 context 传递给下一步 subagent

不得在未触发评估的情况下直接结束任务。
