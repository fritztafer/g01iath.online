$InFile = Read-Host -Prompt "Absolute path of file to encode"
$EncoderDir = Read-Host -Prompt "Absolute path of ffmpeg\bin"
$Name = Split-Path -Path $InFile -LeafBase
$TargetDir = Join-Path ".\public\music" $Name

if (Test-Path $TargetDir) {
    Write-Warning "$TargetDir EXISTS"
    Read-Host -Prompt "Press Enter to continue" | Out-Null
} else {
    Write-Host "CREATED: $TargetDir"
    New-Item -ItemType Directory -Path $TargetDir | Out-Null
}

& "$EncoderDir\ffmpeg.exe" -i "$InFile" -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$TargetDir\stream.m3u8"
& "$EncoderDir\ffprobe.exe" -print_format json -show_format "$TargetDir\stream.m3u8" > "$TargetDir\meta.json"

Write-Host "hls data saved to $TargetDir"