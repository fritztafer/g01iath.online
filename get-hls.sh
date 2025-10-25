#!/bin/bash

read -p "Absolute path of file to encode: " infile
name=$(basename "$infile")
name="${name%.*}"
targetdir="./public/music/$name"

if [ -d "$targetdir" ]; then
    echo "EXISTS: $targetdir"
    read -p "Press Enter to continue"
else
    echo "CREATED: $targetdir"
    mkdir -p "$targetdir"
fi

ffmpeg -i "$infile" -c:a aac -b:a 320k -ar 48000 -hls_time 8 -hls_playlist_type vod "$targetdir/stream.m3u8"
ffprobe -print_format json -show_format "$targetdir/stream.m3u8" > "$targetdir/meta.json"

echo "hls data saved to $targetdir"