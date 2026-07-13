# 常见问题速查

## Q: 为什么 import 报错？

A: 检查装饰器类型。本项目用 `@mikro-orm/decorators/legacy`，不是 `@mikro-orm/core`。

## Q: PrimaryKey 用什么类型？

A: 自增用 `number`，UUID 用 `string`。不要用 `string` 配自增主键。

## Q: 如何查询附近的位置？

A: 使用 PostGIS 扩展 + `ST_DWithin` 函数，或直接用经纬度计算。

## Q: 如何定义可选字段？

A: 使用 `@Property({ nullable: true })` 并声明为 `?: Type`。

## Q: persist() 和 flush() 的区别？

A: `persist()` 标记实体待持久化，`flush()` 执行所有待持久化的操作。可以多次 `persist()`，最后一次性 `flush()`。

## Q: 如何获取实体引用而不查询数据库？

A: 使用 `em.getReference(Entity, id)`，返回一个只包含主键的实体引用。

## Q: 如何只加载部分字段？

A: 使用 `fields` 选项：`em.findOne(Entity, id, { fields: ['name', 'email'] })`。

## Q: 如何实现分页？

A: 使用 `em.findAndCount()` 获取数据和总数，或使用 `em.findByCursor()` 进行游标分页。

## Q: Repository 为什么没有 persist/flush 方法？

A: v6 起移除。使用 `em.persist()` / `em.flush()` 或 `repository.getEntityManager().persist()`。

## Q: QueryBuilder 如何获取实体实例而非原始对象？

A: 使用 `getResult()` / `getSingleResult()` / `getResultList()`，而非 `execute()`。

## Q: 如何在 NestJS 队列/定时任务中使用 MikroORM？

A: 使用 `@CreateRequestContext()` 装饰器，并确保注入了 `MikroORM` 实例。

## Q: Type instantiation is excessively deep 错误？

A: 提供显式类型参数：`em.find<Book>(Book, { ... })`，或使用 Repository，或 `as any` 类型断言。

## Q: 如何处理循环依赖？

A: 使用 `() => Entity` 回调形式：`@ManyToOne(() => Author)`，避免直接引用。

## Q: 迁移文件生成后需要手动编辑吗？

A: 通常不需要。但如果涉及 Supabase 系统表，可能需要手动删除相关 SQL。

## Q: 如何在测试中重置数据库？

A: 使用 `await orm.schema.refresh()` 或 `await orm.schema.clearDatabase()`。
