FROM mongo

COPY /dataLinks.json /dataLinks.json

EXPOSE 27017

CMD mongoimport --host mongodb --db walloftargets --collection geneslinks --type json --file /dataLinks.json --jsonArray