echo "Starting Mongo"
# No fork here so it does not break on windows
mongod --bind_ip_all --dbpath=$1

# For Windows get netcat here: https://joncraton.org/blog/46/netcat-for-windows/
  # just download and add the .exe to the Windows System32 folder
while ! nc -z localhost 27017; do
  sleep 0.1 # wait for 1/10 of the second before check again
done