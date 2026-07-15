---
alwaysApply: false
description: 浏览器自动化工具，用于前端页面验证、UI 调试、表单测试、浏览器交互，涉及前端页面检查时自动触发
---

# Chrome DevTools MCP

## 用途

浏览器自动化工具，用于前端页面验证、UI 调试、表单测试、浏览器交互。

## 触发条件

- 涉及前端页面检查
- UI 调试
- 表单测试
- 浏览器交互
- 页面截图
- 性能分析

## 使用示例

```
任务：检查前端页面的表单验证
→ 自动匹配：chrome-devtools MCP

任务：截图当前页面
→ 自动匹配：chrome-devtools MCP

任务：分析页面性能
→ 自动匹配：chrome-devtools MCP
```

## 注意事项

- 某些操作需要凭证注入，由 hooks 自动处理
- 匹配失败时，回退到通用工具（如 Read/Write/Grep）
- 需要浏览器环境才能使用
