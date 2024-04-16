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
import bodyParser from "body-parser";
import SocketConnection from "./Loaders/socket";

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
export class Server {
    protected app: Application;
    protected server: any;

    public constructor() {
        this.app = express();
    }

    public initial() {
        this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
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

		// this.app.use("", (req, res) => res.sendFile("index.html", {root: __dirname}))
		// set app router
		router.initialize(this.app);

		// error handler
		this.app.use((err: any, req: Request, res: Response, next: NextFunction) =>
			ErrorHandler.initializeErrorHandler(err, req, res, next)
		);

		this.server = new http.Server(this.app);
	}

    public getApp() {
        return this.app;
    }

    public getServer() {
        return this.server;
    }

    public start() {
        this.server.listen(3003, () => {
            console.log("Server is listening on port", process.env.PORT);
        });
    }
}

(async () => {
    try {
        const server: Server = new Server();
        const loader: Loader = new Loader();
        const tables: Tables = new Tables();
        const socket: SocketConnection = new SocketConnection();

        await server.initial();
        await loader.load();
        await tables.createTables();

        const io: SocketIOServer = new SocketIOServer(server.getServer(), {
            cors: {
                origin: "*",
                credentials: true,
                methods: ["GET", "POST"],
            },
        });
        await socket.init(io);
        server.start();

    } catch (err) {
        console.log("Connect to server failed!");
        console.log(`Error: ${err}`);
    }
})();
