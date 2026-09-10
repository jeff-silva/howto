#!/bin/bash
# render.sh
# This script uses Docker to execute Hyperframes and render the video

echo "🎬 Starting HyperFrames render via custom Docker container..."

# Build the docker image locally
docker build -t hyperframes-renderer .

# Run the container and mount the current directory to /app
# We also mount a local .cache folder to /root/.cache so the downloaded Chrome is preserved between runs!
docker run --rm \
  -v "$(pwd):/app" \
  -v "$(pwd)/.cache:/root/.cache" \
  hyperframes-renderer

echo "✅ Render complete! Check output.mp4"
