import ChannelController from "../Controllers/Channel.controller";
import { Request, Response, Router, NextFunction } from "express";
import { Authorization } from "../Middlewares/Authorization";
import { AuthMiddleware } from "../Middlewares";

class ChannelRouter {
    protected channelController: ChannelController;

    constructor() {
        this.channelController = new ChannelController();
    }

    public initialize(router: Router) {
        router
            .route("/channels")
            .get(
                AuthMiddleware.initialize,
                Authorization.initialize,
                (req: Request, res: Response, next: NextFunction) =>
                    this.channelController.getChannel(req, res, next)
            )
            .post(
                AuthMiddleware.initialize,
                Authorization.initialize,
                (req: Request, res: Response, next: NextFunction) =>
                    this.channelController.sendMessage(req, res, next)
            );
        router    
            .route("/channels/messages")
            .get(
                AuthMiddleware.initialize,
                Authorization.initialize,
                (req: Request, res: Response, next: NextFunction) =>
                    this.channelController.getMessages(req, res, next)
            )
    }
}

export default ChannelRouter;
