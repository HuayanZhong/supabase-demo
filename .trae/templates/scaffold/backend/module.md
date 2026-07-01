# Module 骨架

适用：新建 NestJS Module，聚合同领域的 Controller / Service / Entity

## 输出文件

`apps/backend/src/{domain}/{domain}.module.ts`

## 骨架内容

```typescript
import { Module } from '@nestjs/common';
// import { MikroOrmModule } from '@mikro-orm/nestjs';
import { {ControllerName} } from './{domain}.controller';
import { {ServiceName} } from './{domain}.service';
// import { {EntityName} } from './{entity-name}.entity';

@Module({
  imports: [
    // 按需引入 MikroOrmModule.forFeature([{EntityName}]) 或其他 Module
  ],
  controllers: [{ControllerName}],
  providers: [{ServiceName}],
  exports: [{ServiceName}],
})
export class {ModuleName} {}
```

## 字段说明

| 字段          | 必填 | 用途                                      |
| ------------- | ---- | ----------------------------------------- |
| `imports`     | 否   | 引入依赖的 Module（DB、其他领域 Module）  |
| `controllers` | 是   | 该 Module 暴露的 Controller               |
| `providers`   | 是   | 该 Module 内可注入的 Service / Repository |
| `exports`     | 否   | 暴露给其他 Module 使用的 provider         |

## 填充规则

| 占位               | 替换为                           |
| ------------------ | -------------------------------- |
| `{domain}`         | 所属领域目录名，如 `goals`       |
| `{ModuleName}`     | PascalCase，如 `GoalsModule`     |
| `{ControllerName}` | PascalCase，如 `GoalsController` |
| `{ServiceName}`    | PascalCase，如 `GoalsService`    |
| `{EntityName}`     | 关联 Entity 类名                 |
| `{entity-name}`    | 关联 Entity 文件名（不含后缀）   |

## 注册 Entity 示例

```typescript
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { {EntityName} } from './{entity-name}.entity';

@Module({
  imports: [MikroOrmModule.forFeature([{EntityName}])],
  // ...
})
```

## 跨 Module 调用示例

被调用方 Module 需在 `exports` 中暴露 Service，调用方在 `imports` 中引入：

```typescript
// goals.module.ts
@Module({
  providers: [GoalsService],
  exports: [GoalsService], // 对外暴露
})
export class GoalsModule {}

// checkin.module.ts
@Module({
  imports: [GoalsModule], // 引入后可注入 GoalsService
  providers: [CheckinService],
})
export class CheckinModule {}
```

## 后处理

- 在 `apps/backend/src/app.module.ts` 的 `imports` 数组中注册新 Module
- 若 Module 需对外提供 Service，务必加入 `exports`
- 确认 `MikroOrmModule.forFeature` 中列出了所有该领域用到的 Entity
- 避免循环依赖，跨 Module 引用单向流动
