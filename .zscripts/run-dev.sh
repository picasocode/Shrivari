#!/bin/bash
cd /home/z/my-project
while true; do
  bun run dev
  echo "Dev server exited, restarting in 3s..." >> /home/z/my-project/dev-restart.log
  sleep 3
done
