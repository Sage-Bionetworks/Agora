FROM mongo

EXPOSE 27017

RUN mkdir /images

COPY ./team_images /images

WORKDIR /images

CMD ls -1r *.jpg | while read x; do mongofiles -d agora -v put $x; echo $x; done