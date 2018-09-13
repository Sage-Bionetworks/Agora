FROM amd64/mongo

COPY ./team_images/*.jpg /team_images/

WORKDIR /team_images

EXPOSE 27017

CMD ls -1r *.jpg | while read x; do mongofiles --host mongodb --port 27017 -d agora -v put $x; done