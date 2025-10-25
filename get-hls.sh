#!/usr/bin/env bash

while true; do
    read -p "Absolute path of file to encode: " InFile
    Name=$(basename "${InFile%.*}")
    TargetDir="./public/music/$Name"

    if [ -d "$TargetDir" ]; then
        echo "$TargetDir EXISTS"
        read -p "Press Enter to continue"
    else
        echo "CREATED: $TargetDir"
        mkdir -p "$TargetDir"
    fi

    ffmpeg -i "$InFile" -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$TargetDir/stream.m3u8"
    ffprobe -print_format json -show_format "$TargetDir/stream.m3u8" > "$TargetDir/meta.json"

    echo "hls data saved to $TargetDir"
    read -p "Press Enter to encode another file"
done