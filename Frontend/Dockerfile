# Build frontend with bun/vite and copy the built files to nginx
FROM oven/bun:1.1.18 AS builder

WORKDIR /app

COPY package.json bun.lock ./

RUN bun install

COPY . .

RUN bun run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
