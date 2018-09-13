FROM amd64/mongo

COPY /team_info.json /team_info.json

EXPOSE 27017

CMD mongoimport --host mongodb --db agora --collection teaminfo --type json --file /team_info.json --jsonArray
