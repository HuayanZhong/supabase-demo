# NestJS 集成

## 模块注册

```typescript
import { MikroOrmModule } from "@mikro-orm/nestjs";
import config from "./mikro-orm.config";

@Module({
  imports: [MikroOrmModule.forRoot(config)],
})
export class AppModule {}
```

> v7 起 `forRoot()` 必须显式传入配置对象，不再接受空参数。

## 注入 EntityManager

```typescript
import { EntityManager } from "@mikro-orm/postgresql";

@Injectable()
export class MyService {
  constructor(private readonly em: EntityManager) {}
}
```

## 注册实体 Repository

```typescript
@Module({
  imports: [MikroOrmModule.forFeature([Photo])],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}

// 在 Service 中注入
@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly photoRepository: EntityRepository<Photo>,
  ) {}
}
```

## autoLoadEntities

```typescript
MikroOrmModule.forRoot({
  autoLoadEntities: true, // 自动注册所有 forFeature() 中的实体
});
```

## 自定义 Repository 免 @InjectRepository

命名规则：`{EntityName}Repository`（与 `getRepositoryToken()` 一致）

```typescript
// author.repository.ts
export class AuthorRepository extends EntityRepository<Author> {}

// 直接注入，无需 @InjectRepository()
constructor(private readonly repo: AuthorRepository) {}
```

## 请求作用域（队列/定时任务）

```typescript
import { CreateRequestContext } from "@mikro-orm/core";

@Injectable()
export class MyService {
  constructor(private readonly orm: MikroORM) {}

  @CreateRequestContext()
  async doSomething() {
    // 在独立的请求上下文中执行
  }
}
```

`@EnsureRequestContext()` 只在没有上下文时创建新的，否则复用现有的。

## 应用关闭

```typescript
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableShutdownHooks(); // 确保数据库连接正确关闭
  await app.listen(3000);
}
```

## 多数据库连接

```typescript
MikroOrmModule.forRoot({ contextName: 'db1', registerRequestContext: false, ... }),
MikroOrmModule.forRoot({ contextName: 'db2', registerRequestContext: false, ... }),
MikroOrmModule.forMiddleware()

// 注入指定连接
constructor(
  @InjectMikroORM('db1') private readonly orm1: MikroORM,
  @InjectEntityManager('db2') private readonly em2: EntityManager,
) {}
```
