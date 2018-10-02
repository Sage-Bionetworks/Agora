#!/bin/bash
set -e
synapseusername="$SYNAPSE_USERNAME"
synapsepassword="$SYNAPSE_PASSWORD"

[ -d ../data/ ] || mkdir ../data/

# Version key/value should be on his own line
DATA_VERSION=$(cat package.json | grep data-version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')

synapse -u ${synapseusername} -p ${synapsepassword} cat --version $DATA_VERSION syn13363290 | tail -n +2 | while IFS=, read -r id version; do
  synapse -u ${synapseusername} -p ${synapsepassword} get --downloadLocation ../data/ -v $version $id ;
done

[ -d ../data/team_images/ ] || mkdir ../data/team_images/

synapse -u ${synapseusername} -p ${synapsepassword} get -r --downloadLocation ../data/team_images/ syn12861877
