---
alwaysApply: false
description: NestJS 后端开发强制约束
scene: backend
---

# NestJS 后端约束

- 控制器必须使用 `@Controller()` 装饰器并定义路由前缀
- 控制器方法必须使用 `@Get()`、`@Post()` 等 HTTP 方法装饰器
- 服务层必须使用 `@Injectable()` 装饰器
- 禁止在控制器中编写业务逻辑，业务逻辑必须在服务层实现
- DTO / Schema 必须校验输入参数，不得信任客户端传入的原始数据
