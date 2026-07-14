# Seeder CLI 命令

所有命令在 `apps/backend` 目录下执行。

## 基本命令

```bash
# 运行默认 seeder（DatabaseSeeder）
npx mikro-orm seeder:run

# 运行指定 seeder
npx mikro-orm seeder:run --class=BookSeeder

# 创建新的 seeder 文件
npx mikro-orm seeder:create DatabaseSeeder
npx mikro-orm seeder:create test            # 生成 TestSeeder
npx mikro-orm seeder:create project-names   # 生成 ProjectNamesSeeder
```

## 重建数据库并运行 seeder

```bash
# 使用 migration:fresh
npx mikro-orm migration:fresh --seed
npx mikro-orm migration:fresh --seed=UsersSeeder

# 使用 schema:fresh
npx mikro-orm schema:fresh --seed
npx mikro-orm schema:fresh --seed=ProjectsSeeder
```

## 注意事项

- 默认运行 `DatabaseSeeder`，可通过 `seeder.defaultSeeder` 配置修改
- `--class` 参数可以指定特定的 seeder 类
- `migration:fresh` 会先删除所有表，再执行迁移，最后运行 seeder
- `schema:fresh` 会根据实体定义重建 schema，然后运行 seeder
