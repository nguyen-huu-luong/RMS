import express, { Application, Request, Response } from 'express';
import swaggerUI from 'swagger-ui-express'
import * as swaggerDocument from '../swagger/swagger.json'
import * as dotenv from 'dotenv';
import bodyParse from 'body-parser';
import cors from 'cors';
import http from 'http';
import Loader from './Loaders';
import Tables from './Models';

import router from './Routers';

dotenv.config();

class Server {
    protected app: Application;
    protected server: any;

    public constructor() {
        this.app = express();
    }

    public initial() {
        this.app.use(bodyParse());
        this.app.use(cors({
            origin: "*",
            credentials: true,
        }))
        this.app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
        this.server = new http.Server(this.app);
    }

    public getApp() {
        return this.app;
    }

    public start() {
        this.server.listen(process.env.PORT || 3003, () => {
            console.log("Server is listening on port", process.env.PORT);
        });
    }
}

(async () => {
    try {
        const server: Server = new Server();
        const loader: Loader = new Loader();
        const tables: Tables = new Tables();

        await server.initial();
        await router.initialize(server.getApp());
        await loader.load();
        await tables.createTables();

        server.start();
    }
    catch (err) {
        console.log("Connect to server failed!");
        console.log(`Error: ${err}`);
    }
})()
