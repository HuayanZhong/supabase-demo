# 执行检查点（强制门禁）

> 本文件是治理系统的强制关卡。每次开始实质性编码任务前，必须将模板复制到 `.trae/memory/runtime/{timestamp}.checkpoint.md` 并填写。
>
> **无检查点文件 → 视为未执行治理流程。**
> **未被读取的规则 = 不存在的规则。**

---

## 阶段 0：路由自检

```
[ROUTE:check] 任务简述：
[ROUTE:match] 领域：
[ROUTE:fast-path] 判定（OK/FALLBACK）：
[ROUTE:rules] 需加载的规则清单：
```

### 规则加载检查

读取 `README.md` 和以下文件（命中即读）：

| 规则文件                   | 已读？（是/否/不适用） | 关键内容摘要（一句话） |
| -------------------------- | ---------------------- | ---------------------- |
| code-style.md              |                        |                        |
| comments.md                |                        |                        |
| naming.md                  |                        |                        |
| frontend/comments.md       |                        |                        |
| frontend/frontend-types.md |                        |                        |
| frontend/i18n.md           |                        |                        |
| frontend/styles.md         |                        |                        |
| shared/monorepo.md         |                        |                        |
| 其他（自填）：             |                        |                        |

---

## 阶段 1-N：分阶段执行计划

按依赖关系拆分，每阶段 2-4 项工作。

| 阶段 | 工作内容 | 涉及文件 | 状态 |
| ---- | -------- | -------- | ---- |
| 1    |
| 2    |
| ...  |

**执行纪律：** 每阶段完成后停一下，回查当前阶段的所有产出是否符合已加载的规则。下一阶段只能在本阶段标记 ✅ 通过后开始。

---

## 最终校验门禁

全部阶段完成后，逐项检查：

- [ ] `pnpm check-types` 通过（exit code 0）
- [ ] 注释：所有新增的导出类型/复杂业务有 Why 注释
- [ ] 注释：无被注释掉的死代码、无文件头部描述、无装饰分隔线
- [ ] i18n：所有新增文本使用 `t()` 引用，且所有语言文件（zh-CN/en/ja/ko）均已添加对应键值
- [ ] 命名：函数/组件符合 `useXxx` / `XxxTab.vue` / `ProjectXxx` 命名模式
- [ ] 文件位置：类型放 types/、工具放 utils/、组件放 components/business/
- [ ] JSON/YAML 语法正确
- [ ] 无硬编码中文字符串（全部通过 t() 引用）
