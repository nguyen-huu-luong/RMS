import express, { Application, Request, Response } from 'express';
import * as dotenv from 'dotenv';
import bodyParse from 'body-parser';
import cors from 'cors';
import http from 'http';
import Loader from './loader';
import Tables from './model';

import router from './router';

dotenv.config();

class Server {
    protected app: any;
    protected server: any;

    public initial() {
        const app: Application = express();
        app.use(bodyParse());
        app.use(cors({
            origin: "*",
            credentials: true,
        }))
        this.app = app;
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
        const server: any = new Server();
        const loader: any = new Loader();
        const tables: any = new Tables();

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
