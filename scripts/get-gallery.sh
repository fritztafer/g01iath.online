#!/bin/bash

TARGET_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)/../public/gallery"
OUTPUT_FILE="$TARGET_DIR/.file-list.json"

mapfile -t files < <(ls "$TARGET_DIR" | grep -Ei "\.(jpe?g|png|gif|webp|txt)$")

{
    printf '[\n'
    for i in "${!files[@]}"; do
        printf '    "%s"' "${files[i]}"
        [[ $i -lt $((${#files[@]} - 1)) ]] && printf ','
        printf '\n'
    done
    printf ']\n'
} > "$OUTPUT_FILE"

head -n -1 "$OUTPUT_FILE" | tail -n +2 | wc -l