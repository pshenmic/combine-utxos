FROM node:20

WORKDIR /app

COPY package-lock.json /app
COPY package.json /app
COPY utils.js /app

RUN npm ci

CMD ["node", "index.js"]
