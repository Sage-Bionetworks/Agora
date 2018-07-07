FROM mongo

COPY /dataLinks.json /dataLinks.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection geneslinks --type json --file /dataLinks.json --jsonArray