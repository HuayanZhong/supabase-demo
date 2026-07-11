---
alwaysApply: false
description: Dashboard 布局约束，涉及 UDashboardGroup/Sidebar/Panel 时生效
---

## 标准结构

```
dashboard.vue (layout)
  └─ UDashboardGroup
      ├─ UDashboardSidebar (主导航，width 12 units)
      └─ UDashboardPanel
          ├─ UDashboardNavbar (#header slot)
          └─ div.p-6 (#body → slot)
              └─ 页面内容
```

## 页面边距

- 父布局 `UDashboardPanel` 提供 `p-6`（24px）统一内边距
- 页面默认继承该边距
- 需要无边距时（聊天/全屏页面）：根元素加 `h-[calc(100%+3rem)] -m-6`
  - `-m-6` 抵消四边 padding
  - `h-[calc(100%+3rem)]` 补偿上下负 margin 吃掉的高度
