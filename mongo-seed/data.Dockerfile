FROM mongo

COPY /data.json /data.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection genes --type json --file /data.json --jsonArray