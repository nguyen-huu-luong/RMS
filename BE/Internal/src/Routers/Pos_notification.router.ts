import { Pos_notificationController } from "../Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";

// @injectable()
class Pos_notificationRouter {
    protected Pos_notificationController: Pos_notificationController;
    constructor() {
        this.Pos_notificationController = new Pos_notificationController();
    }

    public initialize(router: Router) {
        const pos_notificationRouter = Router();
        pos_notificationRouter.get("/all",this.Pos_notificationController.getAllPos_notification.bind(this.Pos_notificationController));
        pos_notificationRouter.get("/:id", this.Pos_notificationController.getPos_notificationInfo.bind(this.Pos_notificationController));
        pos_notificationRouter.post("", this.Pos_notificationController.createPos_notification.bind(this.Pos_notificationController));
        pos_notificationRouter.delete("/:id", this.Pos_notificationController.delete.bind(this.Pos_notificationController));

        router.use("/pos_notifications", AuthMiddleware.initialize, Authorization.initialize, pos_notificationRouter);
    }
}

export default Pos_notificationRouter;