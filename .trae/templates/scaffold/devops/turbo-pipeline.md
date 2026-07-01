# Turbo Pipeline 骨架

适用：修改 turbo.json 任务管线

## 输出文件

`turbo.json`

## 骨架结构

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "ui": "tui",
  "tasks": {
    "build": {
      "description": "编译打包应用，先构建依赖包再构建当前包",
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".output/**", ".nuxt/**"]
    },
    "check-types": {
      "description": "TypeScript 类型检查",
      "dependsOn": ["^check-types"]
    },
    "lint": {
      "description": "使用 oxlint 检查代码规范"
    },
    "format": {
      "description": "使用 oxfmt 检查代码格式"
    },
    "format:fix": {
      "description": "使用 oxfmt 自动修复代码格式"
    },
    "dev": {
      "persistent": true,
      "cache": false
    }
  }
}
```

## 新增任务规则

| 任务         | dependsOn | outputs  | cache | 说明                 |
| ------------ | --------- | -------- | ----- | -------------------- |
| 纯 lint 检查 | 无        | 无       | 默认  | 无产物               |
| 代码生成     | `^build`  | 生成目录 | 默认  | 有产物时配置 outputs |
| test         | `^build`  | 无       | 默认  | 通常无持久产物       |
| dev          | 无        | 无       | false | 长时间运行           |

## 注意事项

- `persistent: true` 仅用于 dev 类长时间运行的任务
- 有产物的任务必须配置 `outputs`，否则 turbo 不会缓存
- 所有 pnpm workspace 脚本通过 `pnpm --filter {name}` 执行
