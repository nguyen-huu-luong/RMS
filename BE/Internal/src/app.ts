import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "../swagger/swagger.json";
import * as dotenv from "dotenv";
import bodyParse from "body-parser";
import cors from "cors";
import http from "http";
import Loader from "./Loaders";
import Tables from "./Models";
import { Server as SocketIOServer, Socket } from "socket.io";
import router from "./Routers";
import { ErrorHandler } from "./Middlewares";

dotenv.config();
declare global {
    namespace Express {
        interface Request {
            userId: number;
            token: string;
            role: string;
            action: string;
        }
    }
}
class Server {
    protected app: Application;
    protected server: any;
    protected io: SocketIOServer;

    public constructor() {
        this.app = express();
        this.io = new SocketIOServer(this.server);
    }

    public initial() {
        this.app.use(bodyParse());
        this.app.use(
            cors({
                origin: "*",
                credentials: true,
            })
        );
        this.app.use(cookieParser());

        // router to api documentation
        this.app.use(
            "/api-docs",
            swaggerUI.serve,
            swaggerUI.setup(swaggerDocument)
        );

        // set app router
        router.initialize(this.app);

        // error handler
        this.app.use(
            (err: any, req: Request, res: Response, next: NextFunction) =>
                ErrorHandler.initializeErrorHandler(err, req, res, next)
        );
        this.server = new http.Server(this.app);
    }

    public getApp() {
        return this.app;
    }
    public setupSocketIO() {
        
        this.io.on("connection", (socket: Socket) => {
            socket.on("connect", () => {
                console.log("User disconnected");
            });
        });
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
        await loader.load();
        await tables.createTables();
		server.setupSocketIO();
        server.start();
    } catch (err) {
        console.log("Connect to server failed!");
        console.log(`Error: ${err}`);
    }
})();
