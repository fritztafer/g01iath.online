$Source = Read-Host -Prompt "SOURCE HLS DATA (public OR staged)"
$SourceDir = "..\$Source\music\"
$OutputDir = "..\staged\music\"
$OutputFile = Join-Path $OutputDir ".file-list.json"

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
                    title = $meta.title
                    artist = $meta.artist
                    duration = $meta.format.duration
                    cover = $meta.cover
                }
            } else {$result[$dir.Name] = @{}}
        }
    }

    return $result
}
function Format-Json { # jonathancrozier.com
    param
    (
        [Parameter(Mandatory = $true, ValueFromPipeline = $true)]
        [String]$Json,

        [ValidateRange(1, 1024)]
        [Int]$Indentation = 4
    )

    $lines = $Json -split '\n'

    $indentLevel = 0

    $result = $lines | ForEach-Object `
    {
        if ($_ -match "[\}\]]")
        {
            $indentLevel--
        }

        $line = (' ' * $indentLevel * $Indentation) + $_.TrimStart().Replace(":  ", ": ")

        if ($_ -match "[\{\[]")
        {
            $indentLevel++
        }

        return $line
    }

    return $result -join "`n"
}

$json = Get-FolderStructure -Path $SourceDir | ConvertTo-Json -Depth 10 | Format-Json

New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
Set-Content -LiteralPath $OutputFile -Value $json -Encoding UTF8
Write-Host "FILE LIST SAVED TO: $OutputFile" -ForegroundColor Green