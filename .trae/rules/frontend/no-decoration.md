---
alwaysApply: false
description: 禁止无效装饰，涉及视觉效果时生效
---

> 原则：**不加装饰比加错装饰好 100 倍**。

## 禁止项

- `backdrop-blur` 及玻璃拟态效果（毛玻璃）
- `ring-*` 装饰性边框光环
- `bg-primary/5`、`bg-primary/10` 等低透明度彩色底色
- `fixed` + `blur` 的大号色块做背景光晕
- `relative` + 绝对定位的装饰性图标

## 允许项

- Nuxt UI 语义色变量直出：`--ui-bg-elevated`、`--ui-border`、`--ui-text-muted`、`--ui-text-highlighted`
- Nuxt UI 组件原生的 color variant（`color="primary"`、`variant="outline"`）
- 必要时使用 `bg-(--ui-bg-elevated)` 等 CSS 变量引用
