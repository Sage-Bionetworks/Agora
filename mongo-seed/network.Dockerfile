FROM amd64/mongo

COPY /network.json /network.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection geneslinks --type json --file /network.json --jsonArray
