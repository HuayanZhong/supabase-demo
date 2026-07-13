$logFile = ".trae/hooks-debug.log"
$timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
Add-Content -Path $logFile -Value "[$timestamp] validate-output.ps1 started"

try {
    $inputJson = [Console]::In.ReadToEnd()
    Add-Content -Path $logFile -Value "[$timestamp] Read input, length: $($inputJson.Length)"

    $parsed = $inputJson | ConvertFrom-Json
    $lastMsg = $parsed.last_assistant_message

    Add-Content -Path $logFile -Value "[$timestamp] Parsed JSON, message length: $($lastMsg.Length)"

    $hasTaskLog = $lastMsg -match '#+\s*(Task Log|任务日志)'
    Add-Content -Path $logFile -Value "[$timestamp] Check task log: $hasTaskLog"

    if (-not $hasTaskLog) {
        Add-Content -Path $logFile -Value "[$timestamp] No task log found, blocking stop"

        $result = @{
            decision = 'block'
            reason   = 'Please output task log (see .trae/rules/task-logging.md) and complete quality verification (see .trae/rules/agent-catalog.md)'
        }

        $output = $result | ConvertTo-Json -Compress
        Add-Content -Path $logFile -Value "[$timestamp] Output: $output"
        Write-Output $output
        exit 0
    }

    $sessionModeFile = ".trae/.session-mode"
    if (Test-Path $sessionModeFile) { Remove-Item $sessionModeFile -Force }

    Add-Content -Path $logFile -Value "[$timestamp] Task log found, allowing stop"
    Add-Content -Path $logFile -Value "[$timestamp] Output: (empty, allowing stop)"
}
catch {
    Add-Content -Path $logFile -Value "[$timestamp] Error: $($_.Exception.Message)"
    Add-Content -Path $logFile -Value "[$timestamp] Stack: $($_.ScriptStackTrace)"
}
