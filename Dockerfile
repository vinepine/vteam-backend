FROM node

WORKDIR /server

COPY index.js .

COPY package*.json .

COPY db.json .

COPY src/ ./src

COPY .env .

npm install socket.io

RUN npm install
