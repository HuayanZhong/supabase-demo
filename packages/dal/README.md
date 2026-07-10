# @supabase/dal

数据访问层，封装 PostgreSQL 仓库模式和查询逻辑。

## 包名

`@supabase/dal`

## 导出入口

| 路径                  | 内容               |
| --------------------- | ------------------ |
| `@supabase/dal`       | 统一入口           |
| `@supabase/dal/pgsql` | 仅 PostgreSQL 仓库 |

## 结构

```
src/
├── repositories/     # 仓库实现（当前仅 pgsql）
│   └── pgsql/        # PostgreSQL 仓库
└── index.ts          # 统一导出
```

## 使用规范

- 仓库函数操作从 `@supabase/types` 导入的强类型数据
- 所有查询基于 PostgreSQL，后续如需兼容其他数据库在新子目录中添加
- 当前为桩状态（`export {}`），逐步按业务域填充仓库
