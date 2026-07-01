---
alwaysApply: false
description: 数据库与 MikroORM 强制约束
scene: backend
---

# 数据库约束

- 实体定义必须使用 MikroORM 装饰器模式（`@Entity`、`@Property`、`@PrimaryKey`）
- 数据库结构变更必须通过 Migration 文件执行，不得手动修改数据库
- 查询性能敏感的路径必须创建数据库索引
