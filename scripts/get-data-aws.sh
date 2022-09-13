#!/bin/bash
set -ex

CURRENT_DIR=$(pwd)
PARENT_DIR="$(dirname "$CURRENT_DIR")"
DATA_DIR=$PARENT_DIR/../data

travisbranch=$(git rev-parse --abbrev-ref HEAD)
echo "Branch name = $travisbranch"

if [[ $travisbranch =~ ^(develop|staging|prod)$ ]]; then
  echo "Valid git branch used!"

  [ -d $DATA_DIR/ ] || mkdir $DATA_DIR/

  # get data version from agora-data-manager repo
  wget https://raw.githubusercontent.com/Sage-Bionetworks/agora-data-manager/$travisbranch/data-manifest.json -O $DATA_DIR/data-manifest-$travisbranch.json --no-check-certificate

  # Version key/value should be on his own line
  DATA_VERSION=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep data-version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
  DATA_MANIFEST_ID=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep data-manifest-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
  TEAM_IMAGES_ID=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep team-images-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
  echo "data-manifest-$travisbranch.json DATA_VERSION = $DATA_VERSION"

  sed -i 's/\(.*data-version": \)\([^ ]*\)/\1"'"$DATA_VERSION"'",/g' package.json

  synapse -u $SYNAPSE_USERNAME -p $SYNAPSE_PASSWORD cat --version $DATA_VERSION $DATA_MANIFEST_ID | tail -n +2 | while IFS=, read -r id version; do
    synapse -u $SYNAPSE_USERNAME -p $SYNAPSE_PASSWORD get --downloadLocation $DATA_DIR -v $version $id ;
  done

  [ -d $DATA_DIR/team_images/ ] || mkdir $DATA_DIR/team_images/

  synapse -u $SYNAPSE_USERNAME -p $SYNAPSE_PASSWORD get -r --downloadLocation $DATA_DIR/team_images/ $TEAM_IMAGES_ID
else
  echo Not a valid branch!
  exit 1
fi
