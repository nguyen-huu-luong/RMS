FROM node
WORKDIR /RMS/BE/Internal
COPY package*.json ./
COPY src/Configs/. ./src/Configs/
COPY ./startup.sh ./
RUN npm install
RUN npm install sequelize-cli@6.3.0
RUN chmod +x startup.sh
EXPOSE 3003
ENTRYPOINT [ "./startup.sh" ]