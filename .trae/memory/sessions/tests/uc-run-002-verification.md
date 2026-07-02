# 使用层面测试 Run-002 — 修复验证

验证方法：对比 12 个 FAIL 用例的**预期日志**与**框架现有能力**。每项验证均为 Grep 证据实证，非模拟执行。

---

## U1 — 用户打断 ✅ PASS

| 预期日志                   | 框架现有 | 证据                   |
| -------------------------- | -------- | ---------------------- |
| `[ENGINE:interrupt] START` | ✅       | logging.md L57         |
| `[ENGINE:checkpoint] SAVE` | ✅       | logging.md L58         |
| `[ENGINE:checkpoint] DONE` | ✅       | logging.md L59         |
| checkpoint JSON 格式       | ✅       | constraint.md L132-145 |
| 触发条件含"等一下/先停下"  | ✅       | constraint.md L125     |

---

## U2 — 用户补充 ✅ PASS

| 预期日志               | 框架现有 | 证据                                               |
| ---------------------- | -------- | -------------------------------------------------- |
| `[ENGINE:amend] START` | ✅       | logging.md L61                                     |
| scope 追加判断逻辑     | ✅       | constraint.md L166（兼容→追加；不兼容→建议新任务） |
| `[ENGINE:amend] EVAL`  | ✅       | constraint.md L175                                 |

---

## U3 — 用户否定自己 ✅ PASS

| 预期日志                  | 框架现有 | 证据                                             |
| ------------------------- | -------- | ------------------------------------------------ |
| `[ENGINE:redirect] START` | ✅       | logging.md L62                                   |
| git revert 方向变更       | ✅       | constraint.md L168（"不能保留→git revert"）      |
| 重新规划 scope            | ✅       | constraint.md L168（"能保留→保留" → scope 更新） |

---

## U4 — 部分接受 ✅ PASS

| 预期日志                  | 框架现有 | 证据                   |
| ------------------------- | -------- | ---------------------- |
| `[ENGINE:partial] START`  | ✅       | logging.md L67         |
| `[ENGINE:partial] SUBMIT` | ✅       | logging.md L68         |
| `[ENGINE:partial] DROP`   | ✅       | logging.md L69         |
| 部分提交规则              | ✅       | constraint.md L227-231 |

---

## U5 — 多重打断 ✅ PASS

| 预期日志                 | 框架现有 | 证据                   |
| ------------------------ | -------- | ---------------------- |
| 方向变更 #1/#2/#3 日志   | ✅       | constraint.md L193-196 |
| 频繁变更 WARN（≥3 次）   | ✅       | constraint.md L190     |
| `[ENGINE:redirect] WARN` | ✅       | logging.md L63         |
| 计数器归零               | ✅       | constraint.md L198     |

---

## V1 — 会话超时恢复 ✅ PASS

| 预期日志                         | 框架现有 | 证据                   |
| -------------------------------- | -------- | ---------------------- |
| checkpoint JSON 格式             | ✅       | constraint.md L132-145 |
| `[MEM:recover] START`            | ✅       | logging.md L111        |
| `[MEM:recover] CHECK 环境一致性` | ✅       | logging.md L112        |
| 恢复流程                         | ✅       | constraint.md L150-155 |

---

## V3 — MCP 中途断连 ✅ PASS

| 预期日志                   | 框架现有 | 证据                                          |
| -------------------------- | -------- | --------------------------------------------- |
| 运行时降级日志             | ✅       | constraint.md L109-115                        |
| 降级走同一方案库           | ✅       | constraint.md L115（"不区分初始和运行时"）    |
| `[ENGINE:degrade] TRIGGER` | ✅       | degradation-registry.md 有完整降级方案表      |
| 降级后记录经验             | ✅       | constraint.md L110（`[ENGINE:degrade] DONE`） |

---

## W2 — 质量豁免 ✅ PASS

| 预期日志                | 框架现有 | 证据                                       |
| ----------------------- | -------- | ------------------------------------------ |
| `[GUARD:override] LOG`  | ✅       | logging.md L80                             |
| 用户主动跳过规则        | ✅       | constraint.md L210（"必须是用户主动要求"） |
| 豁免记录写入 experience | ✅       | constraint.md L213                         |

---

## W3 — 需求收缩 ✅ PASS

| 预期日志                | 框架现有 | 证据                                     |
| ----------------------- | -------- | ---------------------------------------- |
| `[ENGINE:shrink] START` | ✅       | logging.md L64                           |
| `[ENGINE:shrink] DROP`  | ✅       | logging.md L65                           |
| scope 缩减规则          | ✅       | constraint.md L167（"超出部分标记废弃"） |

---

## W4 — 需求膨胀 ✅ PASS

| 预期日志              | 框架现有 | 证据                                      |
| --------------------- | -------- | ----------------------------------------- |
| `[ENGINE:scope] WARN` | ✅       | logging.md L66                            |
| 膨胀检测规则          | ✅       | constraint.md L169（"超范围→建议新任务"） |

---

## X1 — 异常 + 打断 ✅ PASS

| 预期日志                   | 框架现有 | 证据                                      |
| -------------------------- | -------- | ----------------------------------------- |
| `[ENGINE:migration] FAIL`  | ✅       | 已有异常处理（constraint.md L75-84）      |
| `[ENGINE:interrupt] START` | ✅       | logging.md L57                            |
| 回滚迁移                   | ✅       | constraint.md L126（异常触发 checkpoint） |
| checkpoint 保存            | ✅       | constraint.md L132-145                    |

---

## X2 — 环境变更 ✅ PASS

| 预期日志                   | 框架现有 | 证据                                        |
| -------------------------- | -------- | ------------------------------------------- |
| checkpoint 含 env_snapshot | ✅       | constraint.md L141-144（lock_hash + nvmrc） |
| `[MEM:recover] CHECK`      | ✅       | logging.md L112                             |
| 环境变化 WARN              | ✅       | logging.md L113                             |
| 建议 pnpm install          | ✅       | constraint.md L154                          |

---

## 汇总

| 用例        | Run-001 | Run-002 | 依据                                                         |
| ----------- | ------- | ------- | ------------------------------------------------------------ |
| U1 用户打断 | FAIL    | ✅ PASS | constraint.md checkpoint + logging.md ENGINE:interrupt       |
| U2 用户补充 | FAIL    | ✅ PASS | constraint.md scope 追加 + logging.md ENGINE:amend           |
| U3 否定自己 | FAIL    | ✅ PASS | constraint.md 方向变更 + logging.md ENGINE:redirect          |
| U4 部分接受 | FAIL    | ✅ PASS | constraint.md 部分提交 + logging.md ENGINE:partial           |
| U5 多重打断 | FAIL    | ✅ PASS | constraint.md 频繁变更检测 + logging.md ENGINE:redirect WARN |
| V1 会话超时 | FAIL    | ✅ PASS | constraint.md checkpoint + logging.md MEM:recover            |
| V2 关闭 IDE | PASS    | ✅ PASS | 不变                                                         |
| V3 MCP 断连 | FAIL    | ✅ PASS | constraint.md 运行时降级 + degradation-registry.md           |
| V4 git 冲突 | PASS    | ✅ PASS | 不变                                                         |
| W1 路由纠正 | PASS    | ✅ PASS | 不变                                                         |
| W2 质量豁免 | FAIL    | ✅ PASS | constraint.md 约束豁免 + logging.md GUARD:override           |
| W3 需求收缩 | FAIL    | ✅ PASS | constraint.md scope 缩减 + logging.md ENGINE:shrink          |
| W4 需求膨胀 | FAIL    | ✅ PASS | constraint.md 膨胀检测 + logging.md ENGINE:scope             |
| X1 复合异常 | FAIL    | ✅ PASS | constraint.md checkpoint + 异常处理                          |
| X2 环境变更 | FAIL    | ✅ PASS | constraint.md env_snapshot + logging.md MEM:recover          |

**结果**: 15/15 ✅ PASS（12 修复 + 3 原通过）
