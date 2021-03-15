FROM nginx

COPY dist /usr/share/nginx/html
# COPY config/docker/nginx.conf /etc/nginx/nginx.conf

WORKDIR /usr/share/nginx/html

EXPOSE 8080
