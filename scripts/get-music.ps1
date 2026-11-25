$TargetDir = Join-Path $PSScriptRoot "..\public\music"
$OutputFile = "$TargetDir\.file-list.json"

function Get-FolderStructure {
    param(
        [string]$Path
    )
    $directories = Get-ChildItem -LiteralPath $Path -Directory | Sort-Object Name
    $result = @{}

    foreach ($dir in $directories) {
        $children = Get-ChildItem -LiteralPath $dir.FullName -Directory

        if ($dir.Name -eq ".cover") {continue}
        elseif ($children.Count -gt 0) {$result[$dir.Name] = Get-FolderStructure -Path $dir.FullName}
        else {
            $metaFile = Join-Path $dir.FullName "meta.json"
            if (Test-Path -LiteralPath $metaFile) {
                $meta = Get-Content -LiteralPath $metaFile -Raw | ConvertFrom-Json
                $result[$dir.Name] = @{
                    duration = $meta.format.duration
                    cover = $meta.cover
                }
            } else {$result[$dir.Name] = @{}}
        }
    }

    return $result
}

$json = Get-FolderStructure -Path $TargetDir | ConvertTo-Json

Set-Content -LiteralPath $OutputFile -Value $json -Encoding UTF8
Write-Host "FILE LIST SAVED TO: $OutputFile" -ForegroundColor Green