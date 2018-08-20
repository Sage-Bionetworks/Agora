# Stop all containers
docker stop $(docker ps -a -q)
# Delete all containers
docker rm $(docker ps -a -q)
# Delete all images
docker rmi $(docker images -q)

# Remove all containers with the Exited status
docker rm $(docker ps -q -f status=exited)

# Removed all dangling volumes
docker volume rm $(docker volume ls -qf dangling=true)
