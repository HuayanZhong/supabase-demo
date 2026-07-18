---
name: tool-tavily-search
alwaysApply: false
description: 网络搜索工具，用于搜索网络信息、获取最新资料，需要搜索网络信息时自动触发
---

# Tavily Search MCP

## 用途

网络搜索工具，用于搜索网络信息、获取最新资料。

## 触发条件

- 需要搜索网络信息
- 获取最新资料
- 查询实时数据
- 验证技术文档
- 获取外部来源

## 使用示例

```
任务：搜索最新的技术文档
→ 自动匹配：tavily_search MCP

任务：查询某个 API 的最新版本
→ 自动匹配：tavily_search MCP

任务：获取某个框架的使用示例
→ 自动匹配：tavily_search MCP
```

## 注意事项

- 优先使用项目内文档
- 无法验证的信息必须标注"此信息未验证"
- 对版本号、API 参数等精确信息，需给出具体引用位置
