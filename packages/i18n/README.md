# @supabase/i18n

国际化翻译数据包，为 monorepo 提供多语言静态翻译。

## 包名

`@supabase/i18n`

## 导出入口

| 路径                                | 内容                                   |
| ----------------------------------- | -------------------------------------- |
| `@supabase/i18n`                    | 4 个命名导出：`zhCN`、`en`、`ja`、`ko` |
| `@supabase/i18n/locales/zh-CN.json` | 简体中文 JSON                          |
| `@supabase/i18n/locales/en.json`    | 英语 JSON                              |
| `@supabase/i18n/locales/ja.json`    | 日语 JSON                              |
| `@supabase/i18n/locales/ko.json`    | 韩语 JSON                              |

## 结构

各语言 key 完全对齐。事实源为 `locales/zh-CN.json`，新增领域前缀前在此文件添加即可。如需查看当前所有 key 及分组，直接读取任意一个 locale JSON 文件的顶层 key。各语言文件始终保持相同 key 集合——修改任一个后必须同步其余 3 个。

## 使用规范

- 本包仅提供静态 JSON 数据，不包含 i18n 运行时
- 前端使用 `useI18n()` composable 消费（非本包导出）
- 修改任一语言的 key 后，**必须同步更新全部 4 个语言文件**
- 新增 key 遵循 `PascalCase` 命名，按业务域前缀分组

## 插值变量

使用 `{name}` 语法，所有语言文件保持相同的占位符名称。

示例：`"Project AiRiskText": "已识别 {count} 个高风险任务，主要集中在 {area} 模块"`
