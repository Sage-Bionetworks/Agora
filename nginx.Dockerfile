# Get the latest Alpine Image from https://hub.docker.com/
FROM alpine:latest

LABEL version="1.0"
LABEL description="NGINX running on the Alpine image (5MB)"

RUN mkdir -p /run/nginx

# Grab the latest NGINX apk, remove the apk cache, and allow permissions
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.5/main" >> /etc/apk/repositories && \
    apk add --update nginx=1.14.0-r1 && \
    rm -rf /var/cache/apk/* && \
    chown -R nginx:www-data /var/lib/nginx

RUN apk add --update openssl

# Do not expand this string
ENV SUBJ "/C=US/ST=Washington/L=Seattle/O=SageBionetworks/CN=agora.ampadportal.org"

# Remove the default NGINX configurations
RUN rm -v /etc/nginx/nginx.conf

#RUN mkdir -p /etc/ssl/certs
#RUN mkdir -p /etc/ssl/private
#RUN mkdir -p /etc/nginx/snippets

#RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj $SUBJ
#RUN openssl dhparam -out /etc/ssl/certs/dhparam.pem 2048

# Add our custom configuration file to replace the original one
ADD ./config/nginx.conf /etc/nginx/
#ADD ./config/snippets/self-signed.conf /etc/nginx/snippets/
#ADD ./config/snippets/ssl-params.conf /etc/nginx/snippets/

# "The EXPOSE instruction informs Docker that the container listens on the specified network ports at runtime"
# https://docs.docker.com/engine/reference/builder/#expose
EXPOSE 80 443

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]