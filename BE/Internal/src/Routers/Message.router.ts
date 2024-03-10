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
            .route("/channel")
            .get(AuthMiddleware.initialize, Authorization.initialize, 
                (req: Request, res: Response, next: NextFunction) =>
                    this.channelController.getChannel(req, res, next)
            )
    }
}

export default ChannelRouter;
