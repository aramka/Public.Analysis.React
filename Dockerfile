FROM mcr.microsoft.com/devcontainers/typescript-node:24
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5173