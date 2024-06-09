FROM node:alpine
WORKDIR /RMS/FE/User
COPY package*.json ./
RUN npm install
EXPOSE 3001
CMD ["npm", "run", "dev"]
