import { container } from "../Configs";
import { ClientController } from "../Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { TYPES } from "../Types/type";
import { Client } from "../Models";
import { inject, injectable } from "inversify";
import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";
import { ClientValidator } from "../Middlewares/Validators/ClientValidators";

// @injectable()
class ClientRouter {
    protected clientController: ClientController;
    constructor() {
        this.clientController = new ClientController();
    }

    public initialize(router: Router) {
        const clientRouter = Router();
        clientRouter.get("/all",this.clientController.getAllClient.bind(this.clientController));
        clientRouter.get("/:id", this.clientController.getClientInfo.bind(this.clientController));
        clientRouter.post("", this.clientController.createClient.bind(this.clientController));
        clientRouter.put("/:id", this.clientController.updateClient.bind(this.clientController));
        clientRouter.delete("/:id", this.clientController.delete.bind(this.clientController));
        clientRouter.get("/opportunity/all", this.clientController.getOpporturnityCustomer.bind(this.clientController))
        clientRouter.post("/segment", this.clientController.segmentCustomerAll.bind(this.clientController))
        clientRouter.post("/segment/:id", this.clientController.segmentCustomer.bind(this.clientController))
        router.use("/customers", AuthMiddleware.initialize, Authorization.initialize, clientRouter);
    }
}

export default ClientRouter;
