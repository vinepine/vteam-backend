FROM node

WORKDIR /server

COPY index.js .

COPY package*.json .

COPY db.json .

RUN npm install
