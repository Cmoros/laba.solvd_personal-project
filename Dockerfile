FROM node:16

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

# Uncomment line below to let ser available outside
# EXPOSE 3000

CMD ["npm", "start"]