# Resources — 资源注册与同步

## 职责

`resources/` 负责管理项目中所有 MCP 和 Skill 的**注册清单与同步流程**，确保治理文件中的资源引用与实际可用资源一致。

```
用户安装新资源
     │
     ├── 在对话框中输入 /sync-resources
     │       │
     │       ▼
     │   AI 自动扫描 mcp.json + skills/ → 对比 registry.md → 按差异执行同步
     │       │
     │       ▼
     └── 更新 registry.md → 传播到各 router.md
```

---

## 文件结构

```
.trae/resources/
├── README.md              # 本文档
├── registry.md            # MCP + Skill 权威注册表
└── sync.md                # 资源同步流程
```

---

## 核心流程

| 步骤   | 文件/动作                                    | 说明             |
| ------ | -------------------------------------------- | ---------------- |
| ① 检测 | `sync-resources.ps1` 或 `sync.md` 触发条件   | 发现新/删/变资源 |
| ② 对比 | 读取 `registry.md` vs `mcp.json` + `skills/` | 标记差异         |
| ③ 更新 | 修改 `registry.md`                           | 更新注册表       |
| ④ 传播 | 修改受影响 `runtime/{domain}/router.md`      | 资源表同步       |
| ⑤ 记录 | 追加变更记录                                 | 可追溯           |

---

## 行为约束

- `registry.md` 是 governance 中所有资源引用的真实来源
- 添加/删除资源后必须先更新注册表，再传播到各 router.md
- 在对话框中输入 `/sync-resources` 可快速扫描并同步差异
