# syntax=docker/dockerfile:1.2

ARG NODE_VERSION=18.14.2
ARG NGINX_VERSION=1.23.3

# Development
FROM node:${NODE_VERSION}-bullseye as dev
RUN apt-get update && \
	apt-get upgrade -yqq && \
	npm update --global npm

# Builder
FROM node:${NODE_VERSION}-alpine as builder
ARG GITHUB_REF_NAME=""
ARG GITHUB_SHA=""
ENV GITHUB_REF_NAME=${GITHUB_REF_NAME}
ENV GITHUB_SHA=${GITHUB_SHA}

RUN apk update && apk upgrade && npm update -g npm
WORKDIR /opt/harrybrwn.github.io
COPY ./package.json ./yarn.lock ./
COPY packages ./packages
RUN yarn install
COPY .git .git
COPY astro.config.mjs tsconfig.json ./
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
FROM nginx:${NGINX_VERSION}-alpine as nginx
COPY --from=static-builder /opt/harrybrwn.github.io/dist /var/www/harrybrwn.github.io
COPY config/nginx.conf /etc/nginx/nginx.conf
# Just for lols
RUN sed -i 's/Server: nginx/Server: butts/g' /usr/sbin/nginx

#
# Server
#
FROM node:${NODE_VERSION}-alpine as server
WORKDIR /opt/harrybrwn.github.io/
COPY --from=server-builder /opt/harrybrwn.github.io .
ENV HOST=0.0.0.0
ENTRYPOINT ["node"]
#CMD ["node_modules/.bin/server"]
CMD ["packages/server/dist/index.js"]
