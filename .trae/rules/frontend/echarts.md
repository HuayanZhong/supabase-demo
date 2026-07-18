---
name: frontend-echarts
alwaysApply: false
description: ECharts 图表规范，涉及 vue-echarts 图表组件时生效
---

## 基础注册

每个图表组件必须显式 `use()` 注册所需模块：

```ts
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { BarChart } from "echarts/charts";
import { TooltipComponent, GridComponent } from "echarts/components";
use([CanvasRenderer, BarChart, TooltipComponent, GridComponent]);
```

## 配置约束

- 渲染器：静态图表用 `CanvasRenderer`，交互频繁用 `SVGRenderer`
- VChart 必加 `autoresize` + `style="width:100%;height:100%"`
- tooltip 必加 `confine: true` 防止溢出
- 父容器使用**固定高度**（如 `h-[130px]`），不使用 `flex-1 min-h-*`（SVG 需要明确尺寸）
- 图表 option 内所有显示文本必须通过 `t()` 国际化
