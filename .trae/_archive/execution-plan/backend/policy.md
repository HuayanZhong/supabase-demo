# Policy — 后端规划决策策略

## API 设计决策

| 场景         | 策略                                         |
| ------------ | -------------------------------------------- |
| 简单 CRUD    | 标准 RESTful（Controller + Service 模式）    |
| 复杂业务逻辑 | 拆分为多个 Service 方法，Controller 只做编排 |
| 需要事务     | 使用 MikroORM `em.transactional()`           |
| 批量操作     | 设计批量端点而非循环调用单条接口             |

## 实体关系决策

| 场景     | 策略                                                     |
| -------- | -------------------------------------------------------- |
| 一对一   | `@OneToOne` + 外键在拥有方                               |
| 一对多   | `@OneToMany` + `@ManyToOne`（多的一方维护外键）          |
| 多对多   | 中间表 Entity + `@ManyToMany`                            |
| 树形结构 | 自引用 `@ManyToOne`（parent） + `@OneToMany`（children） |

## 错误处理决策

| 场景           | 策略                                        |
| -------------- | ------------------------------------------- |
| 资源不存在     | throw `NotFoundException`                   |
| 参数校验不通过 | throw `BadRequestException`                 |
| 权限不足       | throw `ForbiddenException`                  |
| 业务冲突       | throw `ConflictException`                   |
| 第三方服务异常 | 捕获后包装为 `InternalServerErrorException` |

## 数据查询决策

| 场景         | 策略                                      |
| ------------ | ----------------------------------------- |
| 单表简单查询 | `EntityRepository.find/findOne`           |
| 关联查询     | `@EntityGraph` 或 `populate` 参数         |
| 复杂聚合     | 原生 SQL 查询（通过 `em.execute()`）      |
| 分页查询     | 标准 `page/size` 参数 + `count/find` 组合 |

## 迁移决策

| 场景       | 策略                                               |
| ---------- | -------------------------------------------------- |
| 新增表     | 新建 Entity + migration:create                     |
| 加字段     | Entity 加属性 + migration:create                   |
| 改字段类型 | Entity 改类型 + migration:create（确认无数据丢失） |
| 删字段/表  | 标注高风险操作，执行前确认                         |
