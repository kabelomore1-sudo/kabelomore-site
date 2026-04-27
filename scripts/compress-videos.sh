#!/usr/bin/env bash
# Compress raw screen-recording videos for web delivery.
# Drop raw videos at scripts/raw-videos/ and run this script.
# Output goes to public/videos/ at web-optimised quality.
#
# Targets: 720p, H.264, no audio, fast-start, ~2-4 MB per 40s clip.
#
# Usage:
#   chmod +x scripts/compress-videos.sh
#   ./scripts/compress-videos.sh

set -euo pipefail

INPUT_DIR="$(dirname "$0")/raw-videos"
OUTPUT_DIR="$(dirname "$0")/../public/videos"

if ! command -v ffmpeg &> /dev/null; then
    echo "✗ ffmpeg not found. Install it first:"
    echo "  Windows: winget install ffmpeg"
    echo "  macOS:   brew install ffmpeg"
    echo "  Linux:   sudo apt install ffmpeg"
    exit 1
fi

if [ ! -d "$INPUT_DIR" ]; then
    echo "✗ Input directory not found: $INPUT_DIR"
    echo "  Create it and drop your raw .mov / .mp4 / .mkv files there."
    exit 1
fi

mkdir -p "$OUTPUT_DIR"

shopt -s nullglob
INPUT_FILES=("$INPUT_DIR"/*.{mov,mp4,mkv,webm,avi,m4v})

if [ ${#INPUT_FILES[@]} -eq 0 ]; then
    echo "✗ No video files found in $INPUT_DIR"
    exit 1
fi

echo "▸ Compressing ${#INPUT_FILES[@]} video(s)..."
echo ""

for input in "${INPUT_FILES[@]}"; do
    filename=$(basename "$input")
    base="${filename%.*}"
    output="$OUTPUT_DIR/${base}.mp4"

    echo "  · $filename"
    echo "    → $output"

    ffmpeg -hide_banner -loglevel warning -y \
        -i "$input" \
        -c:v libx264 \
        -crf 28 \
        -preset slow \
        -vf "scale='min(1280,iw)':-2" \
        -an \
        -movflags +faststart \
        -profile:v high -level 4.0 -pix_fmt yuv420p \
        "$output"

    in_size=$(du -h "$input" | cut -f1)
    out_size=$(du -h "$output" | cut -f1)
    echo "    ✓ $in_size → $out_size"
    echo ""
done

echo "✓ All videos compressed → $OUTPUT_DIR"
