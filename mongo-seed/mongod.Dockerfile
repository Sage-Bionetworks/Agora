FROM khezen/mongo:latest

EXPOSE 27017

# Start mongodb with logging
# --logpath    Without this mongod will output all log information to the standard output.
# --logappend  Ensure mongod appends new entries to the end of the logfile. We create it first so that the below tail always finds something
RUN echo "Starting Mongo"
CMD mongod --fork --bind_ip_all --logpath /var/log/mongodb.log
