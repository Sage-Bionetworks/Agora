FROM node:latest

RUN apt-get update
RUN apt-get install -y netcat
RUN apt-get install -y dnsutils

COPY package.json ./

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && mv ./node_modules ./ng-app

WORKDIR /ng-app

ADD . .

RUN npm run build:aot:prod

ADD start-server.sh /ng-app/start-server.sh
RUN chmod +x /ng-app/start-server.sh

EXPOSE 3000

CMD ["bash", "/ng-app/start-server.sh"]
