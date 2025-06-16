#!/bin/bash
set -x

node start.js &

/usr/bin/cloudflared tunnel --config /home/starcom/.cloudflared/zuma.yml run a644da2e-d629-473a-9022-3df5b0cf2956 &
wait