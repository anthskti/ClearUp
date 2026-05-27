# Deploy the API as a container (optional). Local dev: docker compose up -d + bun run dev on the host.
# Build:  docker build -t clearup-api .
# Run:    docker run --env-file .env -p 5050:5050 clearup-api

FROM oven/bun:1.2-alpine AS build
WORKDIR /app
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile
COPY . .
RUN bun run build

FROM oven/bun:1.2-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile --production
COPY --from=build /app/dist ./dist
COPY certs ./certs
EXPOSE 5050
CMD ["bun", "run", "start"]
