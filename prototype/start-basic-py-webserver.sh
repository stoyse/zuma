#!/bin/bash

# Start Python HTTP server in the background
python3 -m http.server 8000 --bind 0.0.0.0 &

# Start Cloudflare tunnel in the background
cloudflared tunnel run zuma-landing &

# Keep the script running to prevent systemd from exiting
wait