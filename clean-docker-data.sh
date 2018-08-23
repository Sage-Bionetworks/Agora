containers=$(docker ps -a -q)
exited_containers=$(docker ps -q -f status=exited)
images=$(docker images -q)
dangling_volumes=$(docker volume ls -qf dangling=true)


if [ -z ${containers} ]
then
    echo "No containers to stop or remove!"
else
    # Stop all containers
    docker stop ${containers} --force
    # Delete all containers
    docker rm ${containers} --force
fi

if [ -z ${images} ]
then
    echo "No images to remove!"
else
    # Delete all images
    docker rmi ${images} --force
fi

if [ -z ${exited_containers} ]
then
    echo "No exited containers to remove!"
else
    # Remove all containers with the Exited status
    docker rm ${exited_containers} --force
fi

if [ -z ${dangling_volumes} ]
then
    echo "No dangling volumes to remove!"
else
    # Removed all dangling volumes
    docker volume rm ${dangling_volumes} --force
fi
