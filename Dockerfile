FROM node:10.15.3-alpine

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
RUN npm config set registry https://anyvision.jfrog.io/anyvision/api/npm/npm/
ARG RUN_TYPE
#RUN PYTHON=/usr/bin/python npm install
RUN npm --verbose $RUN_TYPE
#ENV PYTHON=/usr/bin/python
#RUN rm .npmrc
ENTRYPOINT ["npm"]
