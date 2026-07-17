# Step 8: 语义检查

检查项目中的语法错误、语义错误和不一致之处，确保治理架构的准确性和一致性。

## 检查范围

### 1. Markdown 文件

- **AGENTS.md**：
  - 生命周期图与实际 hooks.json 一致性
  - 规则表与实际规则文件列表一致性
  - 生效方式与实际触发机制一致性

- **rules/README.md**：
  - 目录结构图与实际文件列表一致性
  - 生效方式表与实际规则文件一致性
  - Hooks 注入关系与实际 hooks.json 一致性

- **hooks/README.md**：
  - 事件明细表与实际 hooks.json 一致性
  - 规则映射表与实际规则文件一致性
  - 脚本描述与实际脚本行为一致性

- **commands/README.md**：
  - 命令描述与实际命令文件一致性
  - 命令表与实际命令文件一致性

- **agents/README.md**（新增）：
  - Subagent 清单表与实际 `.trae/agents/*.md` 文件一致性
  - 文件结构图与实际目录一致性

### 2. 配置文件

- **hooks.json**：
  - 脚本路径与实际 .ps1 文件存在性
  - matcher 正则表达式有效性
  - 字段类型和值合法性

- **.env.example**：
  - 变量名与规则文件中的引用一致性

### 3. Skills

- **SKILL.md**：
  - frontmatter name 是否与文件路径匹配
  - description 是否符合规范（包含功能 + 触发条件）
  - 是否有 references 目录且内容完整

- **Junction 同步**：
  - `.agents/skills/` 与 `.trae/skills/` 的 junction 目标路径一致性

### 4. 规则文件

- **frontmatter 元数据**：
  - name 是否存在
  - description 是否存在
  - 是否有 language 字段（中文优先）

### 5. Subagent 文件

- **frontmatter 元数据**：
  - `name` 是否存在且合法（字母开头，含字母/数字/连字符，≤50 字符）
  - `description` 是否存在且包含明确触发关键词
  - `tools` 是否只包含有效工具名（Read/Glob/Grep/Write/Bash/LSP/Skill/WebSearch/WebFetch）
  - 被允许的工具在项目中确实存在（如 `Bash` 需终端可用、`Skill` 需有对应 skill 实现）

- **文件结构**：
  - 文件名 = `{name}.md`（kebab-case 一致性检查）
  - 文件路径 = `.trae/agents/{name}.md`
  - `logs/` 目录存在，`agent-invoke.log` 非空

## 执行

### 4.1 Markdown 语义检查

对以下文件进行语义一致性检查：

```powershell
$markdownFiles = @(
  ".trae/AGENTS.md",
  ".trae/rules/README.md",
  ".trae/hooks/README.md",
  ".trae/commands/README.md",
  ".trae/agents/README.md"
)

foreach ($file in $markdownFiles) {
  if (Test-Path $file) {
    # 检查表格内容与实际文件的一致性
    # 检查引用路径的有效性
    # 检查图表与实际数据的一致性
  }
}
```

### 4.2 配置文件检查

```powershell
# 检查 hooks.json 中的脚本路径
$hooksJson = Get-Content ".trae/hooks.json" | ConvertFrom-Json
$scriptErrors = @()

foreach ($event in $hooksJson.hooks.PSObject.Properties) {
  foreach ($hook in $event.Value.hooks) {
    $scriptPath = $hook.command -replace "powershell -ExecutionPolicy Bypass -File ", ""
    if (-not (Test-Path $scriptPath)) {
      $scriptErrors += "事件 {$($event.Name)} 中的脚本路径 {$scriptPath} 不存在"
    }
  }
}

# 检查 matcher 正则表达式
foreach ($event in $hooksJson.hooks.PSObject.Properties) {
  foreach ($matcher in $event.Value) {
    if ($matcher.matcher) {
      # 测试 matcher 是否为有效正则表达式
      try {
        [regex]::new($matcher.matcher)
      } catch {
        $scriptErrors += "事件 {$($event.Name)} 中的 matcher 正则表达式无效: {$($matcher.matcher)}"
      }
    }
  }
}
```

### 4.3 Skills 检查

```powershell
$skillsErrors = @()

# 检查 .agents/skills/ 下的每个技能包
if (Test-Path ".agents/skills") {
  $skillDirs = Get-ChildItem ".agents/skills" -Directory
  foreach ($skill in $skillDirs) {
    # 检查 SKILL.md 是否存在
    $skillMd = Join-Path $skill.FullName "SKILL.md"
    if (-not (Test-Path $skillMd)) {
      $skillsErrors += "技能包 {$($skill.Name)} 缺少 SKILL.md"
    }

    # 检查 frontmatter
    if (Test-Path $skillMd) {
      $content = Get-Content $skillMd -Raw
      if (-not ($content -match '^---\s*\nname:\s*"([^"]+)"\s*\n')) {
        $skillsErrors += "技能包 {$($skill.Name)} 的 SKILL.md 缺少 name 字段"
      }
      if (-not ($content -match 'description:\s*"([^"]+)"')) {
        $skillsErrors += "技能包 {$($skill.Name)} 的 SKILL.md 缺少 description 字段"
      }
    }
  }
}
```

### 4.4 规则文件检查

```powershell
$ruleErrors = @()

$ruleFiles = Get-ChildItem ".trae/rules" -Recurse -Filter "*.md"
foreach ($ruleFile in $ruleFiles) {
  $content = Get-Content $ruleFile -Raw

  # 检查 frontmatter
  if ($content -match '^---\s*$' -and $content -match '^---\s*$') {
    $frontmatterEnd = ($content -split '^---\s*$')[1]
    $frontmatter = $frontmatterEnd -split "`n" | Select-Object -First 3

    $hasName = $frontmatter -match 'name:\s*'
    $hasDesc = $frontmatter -match 'description:\s*'

    if (-not $hasName) {
      $ruleErrors += "规则文件 {$($ruleFile.FullName)} 缺少 name 字段"
    }
    if (-not $hasDesc) {
      $ruleErrors += "规则文件 {$($ruleFile.FullName)} 缺少 description 字段"
    }
  }
}
```

### 4.5 Subagent 文件检查

```powershell
$agentErrors = @()
$agentDir = ".trae/agents"
$agentFiles = Get-ChildItem "$agentDir" -Filter "*.md" | Where-Object { $_.Name -ne "README.md" }

foreach ($agentFile in $agentFiles) {
  $content = Get-Content $agentFile -Raw

  # 检查 frontmatter
  if ($content -match '^---\s*\n(.*?)\n---') {
    $frontmatter = $matches[1]

    # 检查 name 合法性
    if ($frontmatter -match 'name:\s*"([^"]+)"') {
      $name = $matches[1]
      if ($name -notmatch '^[a-zA-Z][a-zA-Z0-9\-]*[a-zA-Z0-9]$') {
        $agentErrors += "Subagent {$($agentFile.Name)} 的 name 不合法: {$name}"
      }
    } else {
      $agentErrors += "Subagent {$($agentFile.Name)} 缺少 name 字段"
    }

    # 检查 description
    if (-not ($frontmatter -match 'description:\s*"')) {
      $agentErrors += "Subagent {$($agentFile.Name)} 缺少 description 字段"
    }

    # 检查 tools
    if ($frontmatter -match 'tools:\s*(.+)') {
      $tools = $matches[1]
      $validTools = @('Read', 'Glob', 'Grep', 'Write', 'Bash', 'LSP', 'Skill', 'WebSearch', 'WebFetch')
      foreach ($tool in ($tools -split ',' | ForEach-Object { $_.Trim() })) {
        if ($tool -and $tool -notin $validTools) {
          $agentErrors += "Subagent {$($agentFile.Name)} 包含无效工具: {$tool}"
        }
      }
    } else {
      $agentErrors += "Subagent {$($agentFile.Name)} 缺少 tools 字段"
    }
  } else {
    $agentErrors += "Subagent {$($agentFile.Name)} 缺少 YAML frontmatter"
  }
}

# 检查日志目录
$logFile = "$agentDir/logs/agent-invoke.log"
if (-not (Test-Path $logFile)) {
  $agentErrors += "Subagent 日志文件缺失: {$logFile}"
}
```

## 输出摘要

```
[{步骤8 语义检查}] Markdown一致性 {N} \| 脚本路径 {N} \| matcher {N} \| Skills {N} \| 规则 {N} \| Subagent {N}
```
