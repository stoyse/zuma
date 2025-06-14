#!/bin/bash

# Starte FastAPI/Uvicorn im Hintergrund
uvicorn main:app --host 0.0.0.0 --port 9000 &

# Starte Cloudflare Tunnel im Hintergrund
cloudflared tunnel run zuma-api &

# Halte das Skript am Leben
wait
