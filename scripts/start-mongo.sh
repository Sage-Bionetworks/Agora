# Abort on error: https://bertvv.github.io/cheat-sheets/Bash.html#writing-robust-scripts-and-debugging
set -o errexit   # abort on nonzero exitstatus
set -o nounset   # abort on unbound variable
set -o pipefail  # don't hide errors within pipes

echo "Starting Mongo"
# No fork here so it does not break on windows
mongod --bind_ip_all --dbpath=$1

command -v nc >/dev/null 2>&1 || { echo "Netcat not found or MongoDB stopped, exiting." >&2; exit 1; }

# For Windows get netcat here: https://joncraton.org/blog/46/netcat-for-windows/
# just download and add the .exe to the Windows System32 folder
while ! nc -z localhost 27017; do
  sleep 0.1 # wait for 1/10 of the second before check again
done