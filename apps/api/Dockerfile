FROM node:24-alpine

WORKDIR /app

COPY package.json package-lock.json* .npmrc ./

RUN npm install

COPY apps/api/prisma/schema.prisma ./apps/api/prisma/
RUN npx prisma generate

COPY . .

RUN npm run build --workspace=api

EXPOSE 3002

CMD ["npm", "run", "dev", "--workspace=api"]