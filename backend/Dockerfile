# Dockerfile for node api

# Build node api
FROM node:18.18-alpine

# Working directory be backend
WORKDIR /backend

COPY package.json .

# COPY ENV variable
COPY .env ./

# COPY tsconfig.json file
COPY tsconfig.json ./

# generated prisma files
COPY prisma ./prisma/

###  Installing dependencies
RUN npm install
RUN npx prisma generate

# copy local files to app folder
COPY . .

EXPOSE 3000

CMD ["npm", "start"]