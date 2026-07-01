# Templates — 代码骨架模板

## 职责

`templates/scaffold/` 提供了标准化代码骨架，execution-engine 在创建新文件时可以直接套用，保证同类文件结构一致、不走样。

## 使用方式

参见 `constraint.md`（使用规范）和 `heuristic.md`（如何选骨架）。

## 文件结构

```
templates/
├── README.md
├── constraint.md        ← 骨架使用硬约束
├── heuristic.md         ← 骨架选择指引
│
└── scaffold/            ← 6 领域共 16 个骨架文件
    ├── backend/         (entity, controller, service, migration)
    ├── frontend/        (page, component, composable)
    ├── devops/          (ci-workflow, turbo-pipeline, config-file)
    ├── quality/         (unit-test, api-test)
    ├── ai/              (service, rag-pipeline)
    └── shared/          (types, i18n)
```
