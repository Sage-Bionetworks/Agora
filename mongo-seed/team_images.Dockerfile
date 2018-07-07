FROM mongo

COPY ./team_images /team_images

EXPOSE 27017

WORKDIR /team_images

CMD ls -1r *.jpg | while read x; do mongofiles -d agora put $x; done