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
        marketingRouter.get("/message-templates/all",this.marketingController.getAllTemplate.bind(this.marketingController));
        marketingRouter.get("/message-templates/:id",this.marketingController.getTemplateInfo.bind(this.marketingController));
        marketingRouter.put("/message-templates/:id",this.marketingController.updateMessageTemplate.bind(this.marketingController));
        marketingRouter.delete("/message-templates/:id",this.marketingController.deleteEmailTemplate.bind(this.marketingController));
        marketingRouter.post("/message-templates",this.marketingController.createMessageTempate.bind(this.marketingController));
        marketingRouter.post("/send-email", this.marketingController.sendEmail.bind(this.marketingController))
        
        router.use("", AuthMiddleware.initialize, Authorization.initialize, marketingRouter);

    }
}

export default MarketingRouter ;