FROM mongo

COPY /teamInfo.json /teamInfo.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection teaminfo --type json --file /teamInfo.json --jsonArray