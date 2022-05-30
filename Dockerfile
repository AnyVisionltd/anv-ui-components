FROM node:12.16.0-alpine as base

RUN apk update \
    && apk add --no-cache \
       ca-certificates \
       busybox-extras \
       libc-dev bash make g++

RUN mkdir -p /root
COPY . /root
WORKDIR /root

## Copy Artifact certificate for login
COPY .npmrc /root/.npmrc

ARG RUN_TYPE
RUN npm --verbose $RUN_TYPE
ENTRYPOINT ["npm"]
