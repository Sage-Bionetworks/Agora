#!/bin/bash
set -ex

CURRENT_DIR=$(pwd)
PARENT_DIR=$(dirname "$CURRENT_DIR")
DATA_DIR=$PARENT_DIR/data

# build docker images
docker build -t sagebionetworks/agora-app:latest -f ./Dockerfile $CURRENT_DIR
docker build -t sagebionetworks/agora-nginx:latest -f ./nginx.Dockerfile $CURRENT_DIR

# move docker files to DATA_DIR, otherwise docker builds will fail on travis
cp -rp $CURRENT_DIR/mongo-seed $DATA_DIR/.

pushd $DATA_DIR
docker build -t sagebionetworks/agora-mongo_data:latest -f ./mongo-seed/rnaseq_differential_expression.Dockerfile $DATA_DIR
docker build -t sagebionetworks/agora-mongo_seed_links:latest -f ./mongo-seed/network.Dockerfile $DATA_DIR
docker build -t sagebionetworks/agora-mongo_seed_info:latest -f ./mongo-seed/gene_info.Dockerfile $DATA_DIR
docker build -t sagebionetworks/agora-mongo_seed_team:latest -f ./mongo-seed/team_info.Dockerfile $DATA_DIR
docker build -t sagebionetworks/agora-mongo_seed_team_images:latest -f ./mongo-seed/team_images.Dockerfile $DATA_DIR
popd

