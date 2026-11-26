$EncodeDir = Read-Host -Prompt "SET `$EncodeDir (..\audio\`$EncodeDir)"
$Files = @(Get-ChildItem -LiteralPath "..\audio\$EncodeDir" -File).FullName
$Encoder = Read-Host -Prompt "ABSOLUTE PATH OF ffmpeg\bin"
$Playlist = Read-Host -Prompt "PLAYLIST"
$OutputDir = "..\staged\music"
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

$Files | ForEach-Object -Process {
    $track = [System.IO.Path]::GetFileNameWithoutExtension($_)

    Write-Host "---NEW TRACK---"
    Write-Host $track -ForegroundColor Blue
    $title = 
        Read-Host -Prompt "TITLE"
        if ([string]::IsNullOrWhiteSpace($title)) {$title = $track -replace '_', ' '}
    $artist = 
        Read-Host -Prompt "ARTIST"
        if ([string]::IsNullOrWhiteSpace($artist)) {$artist = "GØ1IATH"}
    $cover = 
        Read-Host -Prompt "COVER"
        $cover = 
            if ([string]::IsNullOrWhiteSpace($cover) -and [string]::IsNullOrWhiteSpace($Playlist)) {"default"}
            elseif ([string]::IsNullOrWhiteSpace($Playlist)) {$cover}
            else {$Playlist}
    $trackDir = 
        if ([string]::IsNullOrWhiteSpace($Playlist)) {"$OutputDir\$track"}
        else {"$OutputDir\$Playlist\$track"}

    if (Test-Path $trackDir) {
        Write-Warning "DIRECTORY EXISTS - $trackDir"
        Read-Host -Prompt "PRESS Enter TO ENCODE" | Out-Null
    } else {
        New-Item -ItemType Directory -Path $trackDir | Out-Null
        Write-Host "DIRECTORY CREATED: $trackDir" -ForegroundColor Green
    } Write-Host "ENCODING..."

    & "$Encoder\ffmpeg.exe" -loglevel error -i $_ -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$trackDir\stream.m3u8"
    & "$Encoder\ffprobe.exe" -loglevel error -print_format json -show_format "$trackDir\stream.m3u8" |
        ConvertFrom-Json |
        Add-Member -MemberType NoteProperty -Name "title" -Value $title -PassThru |
        Add-Member -MemberType NoteProperty -Name "artist" -Value $artist -PassThru |
        Add-Member -MemberType NoteProperty -Name "cover" -Value $cover -PassThru |
        ConvertTo-Json -Depth 10 | Format-Json |
        Set-Content -LiteralPath "$trackDir\meta.json" -Encoding UTF8

    Write-Host "HLS DATA SAVED TO: $trackDir" -ForegroundColor Green
} -End {
    Write-Host "DONE"
}