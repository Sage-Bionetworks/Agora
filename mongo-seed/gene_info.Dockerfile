FROM amd64/mongo

COPY /gene_info.json /gene_info.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection geneinfo --type json --file /gene_info.json --jsonArray
