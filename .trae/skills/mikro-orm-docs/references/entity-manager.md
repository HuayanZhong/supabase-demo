# EntityManager 核心用法

## 持久化操作

```typescript
// persist() 标记实体待持久化（新实体 → INSERT，已有实体 → 标记变更）
em.persist(entity);

// flush() 执行所有待持久化的操作（计算变更集 → 执行 SQL）
await em.flush();

// 链式调用
em.persist([entity1, entity2]).flush();

// 级联持久化：persist 一个实体时，未持久化的关联实体会自动级联
await em.persist([book1, book2, book3]).flush();
// author 和 publisher 会自动级联持久化
```

## 查询方法

```typescript
// 查询单个
const user = await em.findOne(User, { id: 1 });

// 按主键查询
const user = await em.findOne(User, 1);

// 查询多个
const users = await em.find(User, { age: { $gt: 18 } });

// 查询所有
const allUsers = await em.findAll(User);

// 分页查询
const [users, count] = await em.findAndCount(User, {}, { limit: 10, offset: 20 });

// 游标分页
const cursor = await em.findByCursor(User, {
  first: 10,
  after: previousCursor,
  orderBy: { id: "desc" },
});

// 流式查询（大数据量）
const stream = em.stream(Book, {
  populate: ["author"],
  where: { price: { $gt: 100 } },
  orderBy: { id: "ASC" },
});
for await (const book of stream) {
  console.log(book.title);
}
```

## 实体引用

```typescript
// 获取引用（不查询数据库，只包含主键）
const userRef = em.getReference(User, 1);

// 设置关系
book.author = em.getReference(Author, 1);

// 删除引用
em.remove(em.getReference(Book, 2));

// 添加到集合
author.books.add(em.getReference(Book, 3));
```

## 部分加载

```typescript
// 只加载指定字段
const user = await em.findOne(User, 1, {
  fields: ["name", "email"],
});

// 排除字段
const user = await em.findOne(User, 1, {
  exclude: ["password"],
});

// 嵌套字段加载
const author = await em.findOne(Author, 1, {
  fields: ["name", "books.title", "books.author", "books.price"],
});
// 注意：必须包含外键字段（如 books.author），否则关系无法正确关联
```

## 填充关系

```typescript
// 查询时填充
const books = await em.findAll(Book, {
  populate: ["author.friends"],
});

// 对已加载实体填充
const authors = await em.createQueryBuilder(Author).select("*").getResult();
await em.populate(authors, ["books.tags"]);
```

## 删除实体

```typescript
// 方式一：通过实体实例
const book = em.getReference(Book, 1);
await em.remove(book).flush();

// 方式二：原生 DELETE 查询
await em.nativeDelete(Book, { id: 1 });
```

## 创建实体

```typescript
// em.create() 创建实体实例（不会自动 persist，除非 persistOnCreate: true）
const user = em.create(User, { name: "John", email: "john@example.com" });
em.persist(user);
await em.flush();
```

## 查询条件操作符

```typescript
// 操作符：$and, $or, $gte, $gt, $lte, $lt, $in, $nin, $eq, $ne, $like, $ilike, $re, $fulltext
const users = await em.find(User, {
  $and: [
    { age: { $gte: 18 } },
    { age: { $lte: 65 } },
    { status: { $in: ["active", "pending"] } },
    { email: { $like: "%@gmail.com" } },
  ],
});

// 按关联实体字段查询（自动 JOIN）
const author = await em.findOne(Author, {
  books: { tags: { name: "TypeScript" } },
});

// 按主键数组查询
const users = await em.find(User, [1, 2, 3, 4, 5]);
```
