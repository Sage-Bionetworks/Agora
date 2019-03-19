[ -d ../data/ ] || mkdir ../data/

echo "Enter your Synapse username"
read synapseusername

echo "Enter you Synapse password"
read synapsepassword

DATA_DIR='../data'
$travisbranch=$(git branch | sed -n '/^\* /s///p')

if test "$travisbranch != develop" || test "$travisbranch != staging" || test "$travisbranch != prod"; then
  echo Not a valid branch!
  exit 1
fi

# get data version from agora-data-manager repo
wget https://raw.githubusercontent.com/Sage-Bionetworks/agora-data-manager/$travisbranch/data-manifest.json -O $DATA_DIR/data-manifest-$travisbranch.json

# Version key/value should be on his own line
DATA_VERSION=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep data-version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
DATA_MANIFEST_ID=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep data-manifest-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
TEAM_IMAGES_ID=$(cat $DATA_DIR/data-manifest-$travisbranch.json | grep team-images-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
echo "data-manifest-$travisbranch.json DATA_VERSION = $DATA_VERSION"

sed -i "s/\"data-version\": \"[^\"][^\"]*\"/\"data-version\": \"$DATA_VERSION\"/g" package.json

# Version key/value should be on his own line
cat package.json | grep data-version | head -1 | awk -F: '{ print $2 }' | sed 's/[^"]*"/$DATA_VERSION/g'

synapse -u ${synapseusername} -p ${synapsepassword} cat --version $DATA_VERSION $DATA_MANIFEST_ID | tail -n +2 | while IFS=, read -r id version; do
  synapse -u ${synapseusername} -p ${synapsepassword} get --downloadLocation ../data/ -v $version $id ;
done

[ -d ../data/team_images/ ] || mkdir ../data/team_images/
synapse -u ${synapseusername} -p ${synapsepassword} get -r --downloadLocation ../data/team_images/ $TEAM_IMAGES_ID
