#!/usr/bin/env bash

echo "Waiting mongodb to launch on 27017..."

while ! nc -z mongodb 27017; do
  sleep 2 # wait for 2 seconds before check again
done

npm run build:server:docker
env NODE_ENV=production node --max_old_space_size=2000  /ng-app/dist/server.js
