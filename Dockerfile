# Stage 1: Build
FROM node:18.11.0 AS builder
WORKDIR /home/node/app
RUN apt-get update && apt-get install -y build-essential python
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Runtime
FROM node:18.11.0
WORKDIR /home/node/app
COPY --from=builder /home/node/app/dist ./dist
COPY --from=builder /home/node/app/node_modules ./node_modules
COPY package*.json ./


EXPOSE 8083
CMD ["node", "dist/src/index.js"]
