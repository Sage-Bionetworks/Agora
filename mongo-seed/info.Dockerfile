FROM mongo

COPY /dataInfo.json /dataInfo.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection geneinfo --type json --file /dataInfo.json --jsonArray