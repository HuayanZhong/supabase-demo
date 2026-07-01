# Component 骨架

适用：新建 Vue 组件

## 输出文件

| 类型     | 路径                                                              |
| -------- | ----------------------------------------------------------------- |
| 业务组件 | `apps/frontend/app/components/business/{domain}/{PascalName}.vue` |
| 通用组件 | `apps/frontend/app/components/common/{PascalName}.vue`            |

## 骨架内容（业务组件）

```vue
<script setup lang="ts">
// interface Props { }
// defineProps<Props>();

// --- 组件逻辑写在这里 ---
</script>

<template>
  <div>
    <!-- UI 内容写在这里 -->
  </div>
</template>
```

## 骨架内容（通用组件，含 props 和 emit）

```vue
<script setup lang="ts">
interface Props {
  // 定义属性
}
interface Emits {
  // (e: 'update', value: string): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// --- 组件逻辑写在这里 ---
</script>

<template>
  <div>
    <!-- UI 内容写在这里 -->
  </div>
</template>
```

## 填充规则

| 占位           | 替换为                               |
| -------------- | ------------------------------------ |
| `{domain}`     | 业务领域目录，如 `goals`、`auth`     |
| `{PascalName}` | PascalCase 组件名，如 `GoalListCard` |

## 命名约定

- 业务组件：`components/business/{domain}/{PascalName}.vue` → Nuxt 自动注册为 `Business{domain}{PascalName}`
- 通用组件：`components/common/{PascalName}.vue` → Nuxt 自动注册为 `Common{PascalName}`

## 后处理

- 检查 Nuxt 自动导入是否正常工作（`pnpm dev` 后确认）
- 非自动导入场景，在引用文件中显式 `import`
