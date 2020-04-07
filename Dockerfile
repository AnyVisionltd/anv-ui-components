FROM node:10.15.3-alpine

RUN apk update \
    && apk add --no-cache \
       ca-certificates \
       busybox-extras \
       python gcc \
       libc-dev bash make g++

RUN mkdir -p /root
COPY . /root
WORKDIR /root

## Copy Artifact certificate for login
RUN npm config set registry https://anyvision.jfrog.io/anyvision/api/npm/npm/
ARG RUN_TYPE
RUN PYTHON=/usr/bin/python npm --verbose $RUN_TYPE

ENTRYPOINT ["npm"]
