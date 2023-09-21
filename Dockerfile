FROM node:latest

RUN mkdir backend
WORKDIR /backend

ENTRYPOINT ["sh", "fastrun.sh"]
