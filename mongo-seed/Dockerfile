FROM mongo

RUN echo "Starting Mongo"
RUN mongod --fork --bind_ip_all --logpath /var/log/mongodb.log

COPY /data.json /data.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection genes --type json --file /data.json --jsonArray