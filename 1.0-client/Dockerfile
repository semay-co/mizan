FROM node:12

WORKDIR /src

COPY package*.json ./

RUN npm i

COPY . .

ENV PORT=3001

CMD [ "npm", "start" ]