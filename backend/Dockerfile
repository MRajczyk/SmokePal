# Dockerfile for node api

# Build node api
FROM node:18.18-alpine

# Working directory be app
WORKDIR /app

COPY package.json .

###  Installing dependencies
RUN npm install

# copy local files to app folder
COPY . .

EXPOSE 5000

CMD ["npm", "start"]