FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* .npmrc ./

RUN npm install

COPY . .

RUN npm run build --workspace=web

EXPOSE 3003

CMD ["npm", "run", "dev", "--workspace=web"]