# Heuristic — 前端规划最佳实践

## 扫描先手

1. 新建组件前，先搜索是否已有同类组件可复用或扩展
2. 搜索范围包括 `app/components/business/` 和 `app/components/common/`
3. 使用 `search-components` 确认 Nuxt UI 是否已提供所需组件

## 文件定位

| 文件类型   | 推荐位置                          |
| ---------- | --------------------------------- |
| 页面       | `app/pages/`（Nuxt 自动路由）     |
| 业务组件   | `app/components/business/<模块>/` |
| 通用组件   | `app/components/common/`          |
| 组合式函数 | `app/composables/`                |
| 布局       | `app/layouts/`                    |

## 拆分原则

- 组件超过 200 行 → 拆分子组件
- 页面超过 300 行 → 拆分为页面 + 业务组件
- 函数超过 30 行 → 拆分为多个小函数
- 多个页面共用逻辑 → 抽取为 composable
- 多处页面共用布局 → 提取为 layout

## 结构先于样式

1. 先用 Nuxt UI 默认样式搭建组件骨架
2. 再用 Tailwind 间距和对齐调整布局
3. 最后处理响应式和暗色模式适配
4. 尺寸不确定时利用 `get-example` 参考已有示例

## 类型先行

- 有 API 数据交互的组件，先确认后端返回结构，再写前端类型
- 跨页面共享的接口类型，标注"需路由到 shared/types"
- composable 的返回值必须显式定义返回类型

## 翻译策略

- 批量翻译 key 建议集中在**一次修改**完成，而不是逐个添加
- 已有翻译文件中查到相同文案的 key → 复用，不新增
- 新增的翻译 key 记录为清单，标注"转 shared 路由处理"，不直接修改翻译文件
