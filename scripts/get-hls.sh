#!/usr/bin/env bash

while true; do
    read -p "ABSOLUTE PATH OF FILE TO ENCODE: " InFile
    Name=$(basename "${InFile%.*}")
    TargetDir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../public/music/$Name"

    if [ -d "$TargetDir" ]; then
        echo "WARNING: DIRECTORY EXISTS - $TargetDir"
        read -p "PRESS Enter TO CONTINUE"
    else
        echo "CREATED DIRECTORY - $TargetDir"
        mkdir -p "$TargetDir"
    fi

    ffmpeg -loglevel error -i "$InFile" -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$TargetDir/stream.m3u8"
    ffprobe -loglevel error -print_format json -show_format "$TargetDir/stream.m3u8" > "$TargetDir/meta.json"

    echo "HLS DATA SAVED TO: $TargetDir"
done