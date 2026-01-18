$EncoderDir = Read-Host -Prompt "ABSOLUTE PATH OF ffmpeg\bin"

while (1) {
    $InFile = Read-Host -Prompt "ABSOLUTE PATH OF FILE TO ENCODE"
    $Name = Split-Path -Path $InFile -LeafBase
    $TargetDir = Join-Path $PSScriptRoot "..\public\music" $Name

    if (Test-Path $TargetDir) {
        Write-Warning "DIRECTORY EXISTS - $TargetDir"
        Read-Host -Prompt "PRESS Enter TO CONTINUE" | Out-Null
    } else {
        Write-Host "CREATED DIRECTORY - $TargetDir"
        New-Item -ItemType Directory -Path $TargetDir | Out-Null
    }

    & "$EncoderDir\ffmpeg.exe" -loglevel error -i "$InFile" -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$TargetDir\stream.m3u8"
    & "$EncoderDir\ffprobe.exe" -loglevel error -print_format json -show_format "$TargetDir\stream.m3u8" > "$TargetDir\meta.json"

    Write-Host "HLS DATA SAVED TO: $TargetDir"
}