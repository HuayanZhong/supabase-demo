# Scaffold — 代码骨架

## 职责

代码骨架文件定义了各领域常见文件类型的标准结构。execution-engine 在创建文件时，根据任务类型选择对应的骨架，填充业务内容，确保产出的一致性。

## 领域目录

| 目录        | 骨架数 | 覆盖类型                                                             |
| ----------- | ------ | -------------------------------------------------------------------- |
| `backend/`  | 6      | entity、controller、service、migration、module、dto                  |
| `frontend/` | 5      | page、component、composable、layout、middleware                      |
| `devops/`   | 5      | ci-workflow、turbo-pipeline、config-file、dockerfile、docker-compose |
| `quality/`  | 3      | unit-test、api-test、e2e-test                                        |
| `ai/`       | 3      | service、rag-pipeline、agent-tool                                    |
| `shared/`   | 4      | types、i18n、lint-config、package                                    |

## 使用

1. 根据任务类型确定需要的骨架
2. 读取对应的骨架文件了解标准结构
3. 按骨架结构填充业务代码
4. 完成后检查是否遗漏骨架中的标准字段
