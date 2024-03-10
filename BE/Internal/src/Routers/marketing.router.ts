import { NextFunction, Request, Response, Router } from "express";
import {MarketingController} from "../Controllers";
import { AuthMiddleware, AuthValidators } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";

class MarketingRouter {
    protected marketingController : MarketingController;
    constructor() {
        this.marketingController = new MarketingController()
    } 
    
    public initialize(router: Router) {
        const marketingRouter  = Router()
        marketingRouter.get("/all",this.marketingController.getAllTemplate.bind(this.marketingController));
        marketingRouter.post("",this.marketingController.createMessageTempate.bind(this.marketingController));

        router.use("/message-templates", AuthMiddleware.initialize, Authorization.initialize, marketingRouter);
    }
}

export default MarketingRouter ;