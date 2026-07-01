---
description: 前端注释强制约束，适用于所有涉及 Vue 组件、TypeScript 代码、模板注释的场景
alwaysApply: false
scene: frontend_comments
---

# 注释约束

- 所有注释必须使用中文
- 模板注释必须使用 `<!-- 注释内容 -->` 格式
- TypeScript 代码注释必须使用 `// 注释内容`（单行）或 `/** 注释内容 */`（JSDoc）

## 禁止

- 禁止在显而易见的代码上添加注释（如 `// 设置 loading` 后跟 `loading.value = true`）
- 禁止注释内容重复代码逻辑
- 组件文件顶部禁止添加文件描述注释
- props / emits / slots 禁止添加 JSDoc
- 禁止在模板内添加功能描述注释（如 `<!-- 这里显示用户名 -->`）
