# Constraint — 模板使用硬约束

## 输出约束

- 骨架填充后必须产出完整可运行的文件，不得包含 TODO、占位符或模板变量残留
- 输出文件必须通过项目已有的 lint 和 format 检查
- 输出文件的命名必须遵循项目的命名规范（backend：kebab-case，frontend：PascalCase 组件名 + kebab-case 文件名）

## 范围约束

- 骨架只能填充业务逻辑，不得修改骨架定义的结构（类名、方法签名、装饰器、导入路径）
- 生成的文件必须放到项目正确目录，骨架不负责创建目录结构
- 跨领域引用（如 frontend 引用 shared types）必须使用项目已有的导入路径别名

## 版本约束

- 骨架内容变更必须同步更新所有引用该骨架的 workflow / heuristic 文件
- 新骨架加入时必须同时在对应的 heuristic 中说明选用条件
