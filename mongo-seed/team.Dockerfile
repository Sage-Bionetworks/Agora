FROM mongo

COPY /teamInfo.json /teamInfo.json

EXPOSE 27017

CMD mongoimport --host mongodb --db walloftargets --collection teaminfo --type json --file /teamInfo.json --jsonArray