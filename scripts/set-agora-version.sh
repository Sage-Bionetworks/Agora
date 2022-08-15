#!/bin/bash
set -e

# Add the git short sha to the agora version
GIT_SHORT_SHA=$(git rev-parse --short HEAD)
VERSION=$(jq -r '.["version"]' ../package.json | sed 's/-.*//g')
AGORA_VERSION=$VERSION-$GIT_SHORT_SHA
echo "AGORA_VERSION=$AGORA_VERSION"
jq -r ".[\"version\"] = \"$AGORA_VERSION\"" ../package.json > ../new-package.json
mv -f ../new-package.json ../package.json
