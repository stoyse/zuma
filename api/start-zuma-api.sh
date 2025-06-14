#!/bin/bash

# Aktiviere das virtuelle Python-Umfeld
source venv/bin/activate

# Starte FastAPI/Uvicorn im Hintergrund
uvicorn main:app --host 0.0.0.0 --port 9000 &

# Starte Cloudflare Tunnel im Hintergrund
#cloudflared tunnel run zuma-api &
cloudflared tunnel --config /home/starcom/.cloudflared/zuma-api.yml run 8403f349-f6ac-45be-84cb-9f3799eabc3f &
# Halte das Skript am Leben
wait