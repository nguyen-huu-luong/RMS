import express, { Application, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import swaggerUI from "swagger-ui-express";
import * as swaggerDocument from "../swagger/swagger.json";
import * as dotenv from "dotenv";
import cors from "cors";
import http from "http";
import Loader from "./Loaders";
import Tables, { Client } from "./Models";
import { Server as SocketIOServer, Socket } from "socket.io";
import router from "./Routers";
import { ErrorHandler } from "./Middlewares";
import SocketConnection from "./Loaders/socket";
import bodyParser from "body-parser";
import { ExpressAdapter } from "@bull-board/express";
// import { createBullBoard } from "bull-board";
import { QueueService } from "./Services/Queue.service";
import { createBullBoard } from "bull-board";
import { BullMQAdapter } from 'bull-board/bullMQAdapter';

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
    this.app.use(express.json());
  }

  public initial() {
    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ extended: false }));
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
    // startQueues();

    
    // const serverAdapter = new ExpressAdapter();
    // serverAdapter.setBasePath("/admin/queues");
    
    
    const queues = new QueueService().getQueues() ;

    const bullBoardRouter = createBullBoard(
      queues.map(queue => (queue && new BullMQAdapter(queue)))
    ).router

    this.app.use("/admin/queues", bullBoardRouter)

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

    // const data = {
    //   from: "minhvuonglht@gmail.com",
    //   to: "vuong.lieu080519@hcmut.edu.vn",
    //   subject: "ffdfa",
    //   html: "<p>Hello </p>",
    //   type: "email",
    //   campaignId: undefined,
    // };

    //   emailQueue.process(emailProcessor)
    // emailQueue.add(data, { attempts: 3 });
    // const jobs = await emailQueue.getJobs(["active", "waiting", "delayed", "completed"])
    // console.log(jobs)
  } catch (err) {
    console.log("Connect to server failed!");
    console.log(`Error: ${err}`);
  }
})(); 
