FROM amd64/mongo

COPY /rnaseq_differential_expression.json /rnaseq_differential_expression.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection genes --type json --file /rnaseq_differential_expression.json --jsonArray
