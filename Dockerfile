ARG NODE_VERSION=18.12.1-alpine
ARG NGINX_VERSION=1.23.3-alpine

# Builder
FROM node:${NODE_VERSION} as builder
RUN apk update && apk upgrade && npm update -g npm
WORKDIR /opt/harrybrwn.github.io
COPY ./package.json ./yarn.lock .
COPY packages ./packages
RUN yarn install
COPY astro.config.mjs tsconfig.json .
COPY src/ src
COPY public/ public
COPY content/ content
RUN yarn astro sync

FROM builder as server-builder
COPY . .
RUN yarn build:server

FROM builder as static-builder
RUN yarn build

#
# Static files
#
FROM scratch as static
COPY --from=static-builder /opt/harrybrwn.github.io/dist /

#
# Nginx
#
FROM nginx:${NGINX_VERSION} as nginx
COPY --from=static-builder /opt/harrybrwn.github.io/dist /var/www/harrybrwn.github.io
COPY config/nginx.conf /etc/nginx/nginx.conf
#RUN sed -i 's/Server: nginx/Server: nginx/g' /usr/sbin/nginx

#
# Server
#
FROM node:${NODE_VERSION} as server
WORKDIR /opt/harrybrwn.github.io/
COPY --from=server-builder /opt/harrybrwn.github.io .
ENV HOST=0.0.0.0
ENTRYPOINT ["node"]
# CMD ["dist/server/entry.mjs"]
CMD ["node_modules/.bin/server"]
