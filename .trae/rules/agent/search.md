---
name: agent-search
alwaysApply: false
description: 文档检索规范，AI 执行搜索任务时自行加载
---

# 文档检索

## 必须调用 MCP/搜索的场景

| 场景                  | 调用方式                                            | 要求                                 |
| --------------------- | --------------------------------------------------- | ------------------------------------ |
| 涉及 API 用法         | `search_docs`（supabase MCP）或 `tavily_search`     | 返回来源 URL，标注版本号             |
| 需要技术参数/配置项   | `tavily_search` + `WebFetch`                        | 至少验证 2 个独立来源                |
| 用户要求提供来源依据  | `tavily_search` 或 `WebFetch`                       | 在回答中附链接                       |
| Nuxt UI 组件用法      | `nuxt-ui MCP` 的 get-component 或 search-components | 优先用 MCP，MCP 无结果再用 WebSearch |
| 运行时/环境兼容性问题 | `tavily_search` + `WebFetch`                        | 至少验证 2 个独立来源；禁止连续猜测  |

## 验证要求

- 优先使用项目内文档（rules / skills / 日志），其次用 MCP 工具，最后用 WebSearch
- 无法验证的信息必须明确标注"此信息未验证"
- 对版本号、API 参数、配置路径等精确信息，需给出具体的引用位置
- **必须查官方文档确认 API**：代码改动涉及第三方库的 API、方法签名、配置项时，必须先打开该库的官方文档站确认当前版本的准确用法

## 注意事项

- 匹配失败时，回退到通用工具（如 Read/Write/Grep）
- 多个 MCP 可能同时适用，选择最相关的
- 某些 MCP 需要凭证注入（如 chrome-devtools），由 hooks 自动处理
