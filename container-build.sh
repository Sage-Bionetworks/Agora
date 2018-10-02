#!/bin/bash
set -e

# build docker images
docker build -t sagebionetworks/agora-app:latest -f ./Dockerfile .
docker build -t sagebionetworks/agora-nginx:latest -f ./nginx.Dockerfile .
docker build -t sagebionetworks/agora-mongod:latest -f ./mongo-seed/mongod.Dockerfile ./mongo-seed
docker build -t sagebionetworks/agora-mongo_data:latest -f ./mongo-seed/rnaseq_differential_expression.Dockerfile ../data
docker build -t sagebionetworks/agora-mongo_seed_links:latest -f ./mongo-seed/network.Dockerfile ../data
docker build -t sagebionetworks/agora-mongo_seed_info:latest -f ./mongo-seed/gene_info.Dockerfile ../data
docker build -t sagebionetworks/agora-mongo_seed_team:latest -f ./mongo-seed/team_info.Dockerfile ../data
docker build -t sagebionetworks/agora-mongo_seed_team_images:latest -f ./mongo-seed/team_images.Dockerfile ../data

