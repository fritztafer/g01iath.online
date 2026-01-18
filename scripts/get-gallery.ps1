$TargetDir = Join-Path $PSScriptRoot "..\public\gallery"
$OutputFile = "$TargetDir\.file-list.json"

$extensionsPattern = '\.(jpe?g|png|gif|webp|txt)$'

$files = Get-ChildItem -Path $TargetDir -File |
    Where-Object { $_.Name -match $extensionsPattern } |
    Select-Object -ExpandProperty Name

$lines = @()
$lines += '['
for ($i = 0; $i -lt $files.Count; $i++) {
    $line = '    "' + $files[$i] + '"'
    if ($i -lt $files.Count - 1) {
        $line += ','
    }
    $lines += $line
}
$lines += ']'

$lines | Set-Content -Encoding UTF8 $OutputFile

if ($files.Count -gt 0) {
    $files.Count | Write-Output
} else {
    0 | Write-Output
}