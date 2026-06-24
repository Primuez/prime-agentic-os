#!/bin/bash

# Universal Agent OS Setup & Launch Script

set -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "=== Universal Agent OS ==="
echo "1. Starting Python Universal Daemon (State + Obsidian Memory Handler)..."

# Ensure venv exists for daemon
if [ ! -d "$DIR/daemon/.venv" ]; then
    python3 -m venv "$DIR/daemon/.venv"
    source "$DIR/daemon/.venv/bin/activate"
    pip install fastapi[all] pydantic
else
    source "$DIR/daemon/.venv/bin/activate"
fi

# Run daemon in the background
pkill -f "uvicorn daemon:app" || true
cd "$DIR/daemon"
nohup uvicorn daemon:app --host 0.0.0.0 --port 8000 > daemon.log 2>&1 &
echo "[ OK ] Daemon running on http://localhost:8000"

echo "2. Building Next.js + React Three Fiber UI Workspace..."
cd "$DIR/ui"
# Ensure dependencies installed
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "[ INFO ] The UI can be run via standard 'npm run dev' or packaged via 'npm run build' and Electron."
echo ""
echo "OS Setup Complete. "
echo "- Daemon is listening on port 8000 for Agent updates (/api/agents/state)."
echo "- Memory writes to: ~/Universal-Agent-OS/memory"
echo "- The frontend 'ui' directory holds the Next.js visual intelligence layer (including the WebGL Particle Morph dashboard)."
