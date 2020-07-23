FROM node:alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

VOLUME ["/usr/src/app/store"]

CMD [ "node", "." ]
