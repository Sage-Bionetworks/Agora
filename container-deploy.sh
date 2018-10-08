#!/bin/bash
set -ex

# push images to dockerhub
docker push sagebionetworks/agora-app:latest
docker push sagebionetworks/agora-nginx:latest
docker push sagebionetworks/agora-mongo_data:latest
docker push sagebionetworks/agora-mongo_seed_links:latest
docker push sagebionetworks/agora-mongo_seed_info:latest
docker push sagebionetworks/agora-mongo_seed_team:latest
docker push sagebionetworks/agora-mongo_seed_team_images:latest

