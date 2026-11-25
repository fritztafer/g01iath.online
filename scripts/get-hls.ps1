$EncoderDir = Read-Host -Prompt "ABSOLUTE PATH OF ffmpeg\bin"
$PlaylistName = Read-Host -Prompt "PLAYLIST NAME (OPTIONAL)"
$Files = Read-Host -Prompt "ABSOLUTE PATH OF FILE(S)"

foreach ($File in ($Files -split ',').Trim()) {
    $Name = [System.IO.Path]::GetFileNameWithoutExtension($File)
    $TargetDir = Join-Path $PSScriptRoot "..\public\music"

    if ([string]::IsNullOrWhiteSpace($PlaylistName)) {$TargetDir = Join-Path $TargetDir $Name}
    else {$TargetDir = Join-Path "$TargetDir\$PlaylistName" $Name}

    if (Test-Path $TargetDir) {
        Write-Warning "DIRECTORY EXISTS - $TargetDir"
        Read-Host -Prompt "PRESS Enter TO CONTINUE" | Out-Null
    } else {
        Write-Host "CREATED DIRECTORY: $TargetDir" -ForegroundColor Green
        New-Item -ItemType Directory -Path $TargetDir | Out-Null
    }

    & "$EncoderDir\ffmpeg.exe" -loglevel error -i "$File" -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$TargetDir\stream.m3u8"
    & "$EncoderDir\ffprobe.exe" -loglevel error -print_format json -show_format "$TargetDir\stream.m3u8" |
        ConvertFrom-Json |
        Add-Member -MemberType NoteProperty -Name "cover" -Value $(if ([string]::IsNullOrWhiteSpace($PlaylistName)) {$Name} else {$PlaylistName}) -PassThru |
        ConvertTo-Json |
        Set-Content -LiteralPath "$TargetDir\meta.json" -Encoding UTF8

    Write-Host "HLS DATA SAVED TO: $TargetDir" -ForegroundColor Green
}