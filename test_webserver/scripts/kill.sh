#!/bin/bash

PIDS=$(ps aux | grep "node \." | grep -v grep | awk '{print $2}')

if [ -z "$PIDS" ]; then
    echo "🟢 No matching 'node .' processes found."
else
    echo "🛑 Stopping the following 'node .' processes:"

    while IFS= read -r PID; do
        kill "$PID"
    done <<<"$PIDS"

    echo "✅ All matching processes stopped."
fi
