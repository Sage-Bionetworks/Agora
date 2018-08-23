containers=$(docker ps -a -q)
exited_containers=$(docker ps -q -f status=exited)
images=$(docker images -q)
dangling_volumes=$(docker volume ls -qf dangling=true)

# Stop all containers
if ! [ -z $container]
then
    docker stop $containers
    # Delete all containers
    docker rm $containers
else
    echo "No containers to stop or remove!"
fi

# Delete all images
if ! [ -z $images ]
then
    docker rmi $images
else
    echo "No images to remove!"
fi

# Remove all containers with the Exited status
if ! [ -z $exited_containers ]
then
    docker rm $exited_containers
else
    echo "No exited containers to remove!"
fi

# Removed all dangling volumes
if ! [ -z $dangling_volumes ]
then
    docker volume rm $dangling_volumes
else
    echo "No dangling volumes to remove!"
fi
