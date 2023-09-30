FROM node:20.7-alpine

RUN mkdir backend
WORKDIR /backend

ENTRYPOINT ["sh", "fastrun.sh"]
