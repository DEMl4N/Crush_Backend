FROM node:latest

RUN mkdir backend
WORKDIR /backend
COPY . .

ENTRYPOINT ["sh", "fastrun.sh"]
