#!/bin/sh
set -eu
cd /workspace
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

if ! curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8787/api/health; then
  mkdir -p /workspace/data /tmp
  DUCKJOURNAL_DB=/workspace/data/duckjournal.sqlite \
    DUCKJOURNAL_API=127.0.0.1:8787 \
    cargo run -p journal-server --release >>/tmp/journal-api.log 2>&1 &
  i=0
  while [ "$i" -lt 90 ]; do
    if curl -sf -o /dev/null --max-time 1 http://127.0.0.1:8787/api/health; then
      break
    fi
    i=$((i + 1))
    sleep 1
  done
fi

npm run dev >>/tmp/app-startup.log 2>&1 &
