#!/usr/bin/env bash
wait_for_db() {
  nslookup mongodb
  if ! nc -z mongodb 27017; then
    echo "Waiting for mongodb..."
    sleep 2
    wait_for_db
  fi
}

wait_for_db

npm run build:server:docker
env NODE_ENV=production node --max_old_space_size=2000  /ng-app/dist/server.js
