FROM node:alpine

RUN npm install -g nodemon

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --silent

COPY . .

EXPOSE 3001
CMD [ "npm", "start" ]