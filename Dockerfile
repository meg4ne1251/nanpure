FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

# CSS/JSをminifyビルド
RUN npm run build

# 本番用に devDependencies を削除
RUN npm prune --omit=dev

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "src/server.js"]
