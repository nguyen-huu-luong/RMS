import { NotificationController } from "../Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";

// @injectable()
class NotificationRouter {
    protected NotificationController: NotificationController;
    constructor() {
        this.NotificationController = new NotificationController();
    } 

    public initialize(router: Router) {
        const notificationRouter = Router();
        notificationRouter.get("/all",this.NotificationController.getAllNotification.bind(this.NotificationController));
        notificationRouter.get("/:id", this.NotificationController.getNotificationInfo.bind(this.NotificationController));
        notificationRouter.post("/:id", this.NotificationController.createNotification.bind(this.NotificationController));
        notificationRouter.get("", this.NotificationController.getNumber.bind(this.NotificationController));
        notificationRouter.put("/:id", this.NotificationController.update.bind(this.NotificationController));

        router.use("/notifications", AuthMiddleware.initialize, Authorization.initialize, notificationRouter);
    }
}

export default NotificationRouter;
