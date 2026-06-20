---
alwaysApply: true
---

# 通用规则

## 语言

- 所有回答使用中文
- 代码注释使用中文
- commit message 使用中文

## 项目结构

Monorepo 项目，使用 pnpm workspace + turborepo：

- `apps/backend` — NestJS 后端
- `apps/frontend` — Nuxt 前端
- `packages/lint-config` — 共享 lint 配置

## 代码风格

- 使用项目已有的工具链（oxlint、oxfmt、prettier）
- 遵循现有代码风格，不引入新约定
- 优先使用项目内已有的工具函数，不重复造轮子

## 文档查询

当遇到以下情况时，**必须先通过 tavily MCP 查询最新文档**，不能仅依赖训练数据或记忆：

- 不确定某个 API、组件、配置字段的参数或行为
- 库版本较新，训练数据可能已过时（项目依赖版本见 `pnpm-workspace.yaml` catalogs）
- 配置不生效、行为与预期不符，需要确认官方用法
- 引入新依赖或新模块前，需要确认兼容性和接入方式

### 查询方式

优先使用以下 tavily MCP 工具：

1. **`tavily_search`** — 通用搜索，适用于查 API 用法、配置项、错误排查等
   - 参数：`query`（必填）、`search_depth`（`basic`/`advanced`）、`max_results`、`include_domains`
   - 查询时在 query 中加上库名 + 版本号以提高准确性，例如：`"nuxt ui 4 ULocaleSelect locale code format"`
   - 优先查官方文档域名：`ui.nuxt.com`、`i18n.nuxtjs.org`、`nuxt.com`、`ui4.nuxt.com`

2. **`tavily_extract`** — 从已知 URL 提取页面正文，适用于精读某个文档页面
   - 参数：`urls`（必填，数组）
   - 适合场景：已知文档地址，需要提取完整内容确认细节

3. **`tavily_crawl`** — 爬取文档站点结构，适用于批量了解某个库的文档组织
   - 参数：`url`（必填）、`max_depth`、`instructions`

### 注意事项

- 查询结果返回后，核对文档版本与项目实际使用的版本是否一致，不一致时在回答中说明
- 如果查询到的文档明确说明某个行为，以文档为准，不要猜测
- 不要把搜索结果中的过时用法当作当前版本的用法，注意核对结果中的版本信息

## 交互方式

- 直接给出方案，不要反复确认
- 改动前先读取相关文件
- 完成后简要说明改了什么、验证了什么
