FROM mongo

COPY /dataInfo.json /dataInfo.json

EXPOSE 27017

CMD mongoimport --host mongodb --db walloftargets --collection geneinfo --type json --file /dataInfo.json --jsonArray