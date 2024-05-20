FROM node
WORKDIR /RMS/BE/Internal
COPY package.json ./
COPy yarn.lock ./
COPY src/Configs/. ./src/Configs/
COPY ./startup.sh ./
RUN apt-get update && apt-get install -y yarn
RUN yarn install
RUN npm install sequelize-cli@6.3.0
RUN chmod +x startup.sh
EXPOSE 3003
ENTRYPOINT [ "./startup.sh" ]