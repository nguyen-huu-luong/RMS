FROM node:alpine
WORKDIR /RMS/FE/admin
COPY package*.json ./
RUN npm install
EXPOSE 3000
CMD ["npm", "run", "dev"]

