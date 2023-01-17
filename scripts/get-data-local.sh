AGORA_LIVE_DATA_MANIFEST='syn13363290'
AGORA_TESTING_DATA_MANIFEST='syn18387112'
LOCAL_DIR='./local'
DATA_DIR='./local/data'
TEAM_IMAGES_DIR='./local/data/team_images/'
PS3='Please select one of the available options: '
OVERRIDE_OPTIONS=('Use default manifest' 'Specify manifest override')
DATA_FOLDERS=("Agora Live Data" "Agora Testing Data" "Other data_manifest")

# Create the data directory and team_images subdirectory, if they don't already exist
[ -d $LOCAL_DIR ] || mkdir $LOCAL_DIR
[ -d $DATA_DIR ] || mkdir $DATA_DIR
[ -d $TEAM_IMAGES_DIR ] || mkdir $TEAM_IMAGES_DIR
echo "Data directory: $DATA_DIR"
echo "Team images directory: $TEAM_IMAGES_DIR"

# Determine the currently checked out Agora branch
travisbranch=$(git rev-parse --abbrev-ref HEAD)
echo "Agora branch name = $travisbranch"

# Determine which agora-data-manager branch to use to populate default manifest version information
# Defaults to agora-data-manager:develop if you aren't on one of the three standard Agora branches (develop, staging, production)
if [[ $travisbranch =~ ^(develop|staging|prod)$ ]]; then
  echo "You are working on the Agora $travisbranch branch; this script will use default values from the corresponding agora-data-manager branch."
else
  travisbranch='develop'
  echo "You are working on an Agora branch that is not develop, staging, or production; this script will use default values from the $travisbranch agora-data-manager branch."
fi

# Downloads the default manifest synId and version from $travisbranch in agora-data-manager repo, as well as the synId for the team_images folder
wget https://raw.githubusercontent.com/Sage-Bionetworks/agora-data-manager/$travisbranch/data-manifest.json -O $DATA_DIR/default-data-manifest-$travisbranch.json --no-check-certificate
DATA_VERSION=$(cat $DATA_DIR/default-data-manifest-$travisbranch.json | grep data-version | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
DATA_MANIFEST_ID=$(cat $DATA_DIR/default-data-manifest-$travisbranch.json | grep data-manifest-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
TEAM_IMAGES_ID=$(cat $DATA_DIR/default-data-manifest-$travisbranch.json | grep team-images-id | head -1 | awk -F: '{ print $2 }' | sed 's/[",]//g' | tr -d '[[:space:]]')
echo "Default manifest is Agora Live Data/data_mainfest.csv from agora-data-manager branch $travisbranch: $DATA_MANIFEST_ID.$DATA_VERSION"

# Prompt user to override the default manifest and/or manifest version if desired
select oo in "${OVERRIDE_OPTIONS[@]}"; do
      case $oo in
          'Use default manifest')
              echo "Data will be downloaded using the default data manifest file and version: $DATA_MANIFEST_ID.$DATA_VERSION"
  	          break
              ;;
           'Specify manifest override')
              echo "Select the data_manifest.json file you want to use:"
              select folder in "${DATA_FOLDERS[@]}"; do
                  case $folder in
                      "Agora Live Data")
                          DATA_MANIFEST_ID=$AGORA_LIVE_DATA_MANIFEST
                          break
                          ;;
                      "Agora Testing Data")
                          DATA_MANIFEST_ID=$AGORA_TESTING_DATA_MANIFEST
                          break
                          ;;
                      "Other data_manifest")
                            echo "Enter the synId of the data_manifest.csv you want to use:"
                              read DATA_MANIFEST_ID
              	            break
                          ;;
                      *) echo "invalid option $REPLY";;
                  esac
              done
              echo "Enter the target data manifest version, or hit enter to default to the latest version:"
                read DATA_VERSION
  	          break
              ;;
          *) echo "invalid option $REPLY";;
      esac
done

echo "Downloading files specified in data-manifest.csv $DATA_MANIFEST_ID.$DATA_VERSION"

# login using credentials (PAT preferred) stored in ~/.synapseCredentials (https://python-docs.synapse.org/build/html/Credentials.html#use-synapseconfig)
synapse login

# iterate over the specified data_manifest.csv to download files
# if no manifest version was specified, read the latest version of the specified manifest file
if [[ -z "$DATA_VERSION" ]]; then
    synapse cat $DATA_MANIFEST_ID | tail -n +2 | while IFS=, read -r id version; do
      # if data_manifest.csv references its own synId (older versions don't), download the latest version
      if [[ $DATA_MANIFEST_ID == $id ]]; then
        synapse get --downloadLocation $DATA_DIR $id ;
        echo "Downloaded most recent version of $id"
      # download the files and versions specified in the manifest
      else
        synapse get --downloadLocation $DATA_DIR -v $version $id ;
        echo "Downloaded $id.$version"
      fi
    done
# otherwise iterate over the specified version of the data_manifest.csv
else
    synapse cat -v $DATA_VERSION $DATA_MANIFEST_ID | tail -n +2 | while IFS=, read -r id version; do
      # if data_manifest.csv references its own synId (older versions don't), download the correct version (AG-543)
      if [[ $DATA_MANIFEST_ID == $id ]]; then
        synapse get --downloadLocation $DATA_DIR -v $DATA_VERSION $id ;
        echo "Downloaded data_manifest.csv $id.$DATA_VERSION"
      # download the files and versions specified in the manifest
      else
        synapse get --downloadLocation $DATA_DIR -v $version $id ;
        echo "Downloaded $id.$version"
      fi
    done
fi

# update package.json to reflect the loaded manifest file and version
if [[ -z "$DATA_VERSION" ]]; then
  DATA_VERSION="latest-$(date +'%m-%d-%Y')"
  echo "$DATA_VERSION"
fi
sed -i '' 's/\(.*data-file": \)\([^ ]*\)/\1"'"$DATA_MANIFEST_ID"'",/g' package.json
sed -i '' 's/\(.*data-version": \)\([^ ]*\)/\1"'"$DATA_VERSION"'",/g' package.json

# Download team image files
echo "Downloading team image files from $TEAM_IMAGES_ID"
synapse get -r --downloadLocation $TEAM_IMAGES_DIR $TEAM_IMAGES_ID

exit 0
