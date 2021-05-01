FROM node
WORKDIR /BE
COPY package*.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD [ "npm", "start" ]