ARG NODE_VERSION=18.12.1-alpine
ARG NGINX_VERSION=1.23.3-alpine

# Builder
FROM node:${NODE_VERSION} as builder
RUN apk update && apk upgrade && npm update -g npm
WORKDIR /opt/harrybrwn.github.io
COPY ./package.json ./yarn.lock .
COPY packages/astro ./packages/astro
RUN yarn install
COPY astro.config.mjs tsconfig.json .
COPY src/ src
COPY public/ public
COPY packages/ packages
COPY content/ content
RUN yarn build

#
# Static files
#
fROM scratch as static
COPY --from=builder /opt/harrybrwn.github.io/dist /

#
# Nginx
#
FROM nginx:${NGINX_VERSION} as nginx
COPY --from=builder /opt/harrybrwn.github.io/dist /var/www/harrybrwn.github.io
COPY config/nginx.conf /etc/nginx/nginx.conf
#RUN sed -i 's/Server: nginx/Server: yeetyboi/g' /usr/sbin/nginx
