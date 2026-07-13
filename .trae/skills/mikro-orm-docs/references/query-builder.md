# QueryBuilder 用法

> 使用 `createQueryBuilder()` 需要从驱动包导入 `EntityManager`：`import { EntityManager } from '@mikro-orm/postgresql'`

## 基本查询

```typescript
const qb = em.createQueryBuilder(User);
// 或简写：em.qb(User)

qb.select("*")
  .where({ age: { $gt: 18 } })
  .orderBy({ name: "ASC" })
  .limit(10);

const users = await qb.getResultList();
```

## 执行方式

```typescript
const res1 = await qb.execute("all"); // 返回对象数组（默认）
const res2 = await qb.execute("get"); // 返回单个对象
const res3 = await qb.execute("run"); // 返回 { affectedRows, insertId, row }

// 获取实体实例（而非原始对象）
const book = await em.createQueryBuilder(Book).select("*").where({ id: 1 }).getSingleResult();
const books = await em.createQueryBuilder(Book).select("*").getResult();
```

## JOIN 查询

```typescript
// 隐式 JOIN（自动，用于过滤和排序）
const users = await em.find(User, {
  books: { tags: { name: "TypeScript" } },
});

// 显式 JOIN（只用于过滤/排序，不填充关系）
const qb = em.createQueryBuilder(User, "u");
qb.select("u.*")
  .leftJoin("u.books", "b")
  .where({ "b.title": { $like: "%ORM%" } });

// joinAndSelect（JOIN 并填充关系）
const authors = await em
  .createQueryBuilder(Author, "a")
  .select("*")
  .leftJoinAndSelect("a.books", "b")
  .leftJoinAndSelect("b.tags", "t")
  .where({ "t.name": ["sick", "sexy"] })
  .getResultList();
// authors[0].books[0].tags[0].name 可直接访问
```

## 复杂条件

```typescript
// 使用操作符
const qb = em.createQueryBuilder(Test);
qb.select("*").where({ $and: [{ id: { $nin: [3, 4] } }, { id: { $gt: 2 } }] });

// 使用 raw SQL 片段
const users = em
  .createQueryBuilder(User)
  .select("*")
  .where({ [sql`lower(email)`]: "foo@bar.baz" })
  .orderBy({ [raw(`(point(lat, lon) <@> point(0, 0))`)]: "ASC" })
  .getResultList();

// andWhere / orWhere
qb.where("title = ? or title = ?", ["test", "lol"]).andWhere("1 = 1").orWhere("1 = 2");
```

## Count 与分页

```typescript
// 获取总数
const count = await em
  .createQueryBuilder(Test)
  .select("*")
  .where({ age: { $gt: 18 } })
  .getCount();

// 分页（自动处理 to-many JOIN 的笛卡尔积问题）
const qb = em.createQueryBuilder(User);
qb.select("*").where({ age: 18 }).limit(10);
const [results, count] = await qb.getResultAndCount();
```

## 子查询 JOIN

```typescript
const subquery = em.createQueryBuilder(Book, 'b')
  .where({ ... })
  .orderBy({ title: 'asc' })
  .limit(1);

const authors = await em.createQueryBuilder(Author, 'a')
  .select('*')
  .leftJoinAndSelect(['a.books', subquery], 'b')
  .leftJoinAndSelect('b.tags', 't')
  .getResultList();
```
