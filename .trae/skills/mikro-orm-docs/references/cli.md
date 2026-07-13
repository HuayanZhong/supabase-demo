# CLI 命令参考

所有命令在 `apps/backend` 目录下执行，使用 `npx mikro-orm` 前缀。

## 迁移相关

```bash
# 创建迁移（根据实体变更生成 SQL）
npx mikro-orm migration:create

# 创建空白迁移
npx mikro-orm migration:create --blank

# 创建初始迁移
npx mikro-orm migration:create --initial

# 执行迁移（应用所有待执行的迁移）
npx mikro-orm migration:up

# 执行指定迁移
npx mikro-orm migration:up --only 2019101923

# 回滚最近一次迁移
npx mikro-orm migration:down

# 回滚到指定版本
npx mikro-orm migration:down --to 0

# 查看所有已执行的迁移
npx mikro-orm migration:list

# 检查是否有待执行的迁移
npx mikro-orm migration:check

# 查看待执行的迁移列表
npx mikro-orm migration:pending

# 清空数据库并重新执行所有迁移
npx mikro-orm migration:fresh

# 清空数据库并执行迁移后运行 seeder
npx mikro-orm migration:fresh --seed

# 标记迁移为已执行（不实际运行）
npx mikro-orm migration:log

# 取消迁移的执行记录（不实际回滚）
npx mikro-orm migration:unlog

# 合并所有迁移为一个
npx mikro-orm migration:rollup
```

## Schema 管理

```bash
# 查看 schema 差异（输出 SQL，不执行）
npx mikro-orm schema:update --dump

# 更新数据库 schema（不生成迁移文件）
npx mikro-orm schema:update --run

# 删除数据库 schema
npx mikro-orm schema:drop --dump

# 重建 schema（删除并重建）
npx mikro-orm schema:fresh --run

# 重建 schema 并运行 seeder
npx mikro-orm schema:fresh --seed
```

## 调试与缓存

```bash
# 调试配置和连接信息
npx mikro-orm debug

# 清除元数据缓存
npx mikro-orm cache:clear

# 生成元数据缓存
npx mikro-orm cache:generate

# 导出实体发现结果（生成 barrel 文件）
npx mikro-orm discovery:export
```

## Seeding 相关

```bash
# 运行默认 seeder（DatabaseSeeder）
npx mikro-orm seeder:run

# 运行指定 seeder
npx mikro-orm seeder:run --class=LocationSeeder

# 创建新的 seeder 文件
npx mikro-orm seeder:create LocationSeeder
```

## 注意事项

- 迁移文件存放在 `src/migrations` 目录
- 执行前确保 `.env` 中的 `DIRECT_URL` 或 `DATABASE_URL` 正确
- Supabase 项目需配置 `schemaGenerator.ignoreSchema` 忽略系统 schema
- 修改实体后工作流：`migration:create` → 检查生成的文件 → `migration:up`
- 迁移默认在事务中执行，所有迁移包裹在一个主事务中
- 快照（snapshot）默认开启，应与迁移文件一起版本控制
