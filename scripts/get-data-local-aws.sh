synapseusername=`aws secretsmanager --region us-east-1 --output text --profile agora get-secret-value --secret-id synapse-agora-username | cut -f 4`
synapsepassword=`aws secretsmanager --region us-east-1 --output text --profile agora get-secret-value --secret-id synapse-agora-password | cut -f 4`

[ -d ../../data/ ] || mkdir ../../data/

DATA_DIR='../../data'
travisbranch=$(git rev-parse --abbrev-ref HEAD)
echo "Branch name = $travisbranch"

if [[ $travisbranch =~ ^(develop|staging|prod)$ ]]; then
  echo "Valid git branch used!"

  # get data version from agora-data-manager repo
  wget https://raw.githubusercontent.com/Sage-Bionetworks/agora-data-manager/$travisbranch/data-manifest.json -O $DATA_DIR/data-manifest-$travisbranch.json --no-check-certificate

  # Version key/value should be on his own line
  DATA_VERSION=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep data-version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
  DATA_MANIFEST_ID=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep data-manifest-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
  TEAM_IMAGES_ID=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep team-images-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
  echo "data-manifest-$travisbranch.json DATA_VERSION = $DATA_VERSION"

  sed -i 's/\(.*data-version": \)\([^ ]*\)/\1"'"$DATA_VERSION"'",/g' package.json

  synapse -u ${synapseusername} -p ${synapsepassword} cat --version $DATA_VERSION $DATA_MANIFEST_ID | tail -n +2 | while IFS=, read -r id version; do
    synapse -u ${synapseusername} -p ${synapsepassword} get --downloadLocation ../data/ -v $version $id ;
  done

  [ -d ../data/team_images/ ] || mkdir ../data/team_images/
  synapse -u ${synapseusername} -p ${synapsepassword} get -r --downloadLocation ../data/team_images/ $TEAM_IMAGES_ID
else
  echo Not a valid branch!
  exit 1
fi
