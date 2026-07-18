---
name: frontend-layout-bfc
alwaysApply: false
description: Flex 布局 + BFC 滚动约束，涉及聊天/列表等需要独立滚动区域时生效
---

聊天类、列表类页面中，需要某个区域独立滚动（而非整页滚动）时，必须遵循以下链路：

```
h-full (根容器) → flex flex-col
  → flex-1 min-h-0 (中间层)
    → overflow-y-auto (BFC 可滚动容器)
      → 内容（flex-1 或自然高度）
```

## 关键规则

- `min-h-0` 是 flex 子元素可收缩的前提条件，**不可遗漏**
- `overflow-y-auto` 创建独立 BFC，使滚动局限于该容器，不扩散到父级（否则整页滚动）
- 滚动条样式由全局 `main.css` 的 `@layer base` 统一管理，无需逐元素添加
