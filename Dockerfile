FROM node:16-alpine3.18

WORKDIR /racetimegg-discord-bot

COPY . .

RUN npm install

RUN npm run

CMD ["node", "index.js"]
