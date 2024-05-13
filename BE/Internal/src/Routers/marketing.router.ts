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
        const marketingRouter = Router()
        marketingRouter.get("/all",this.marketingController.getAllTemplate.bind(this.marketingController));
        marketingRouter.get("/:id",this.marketingController.getTemplateInfo.bind(this.marketingController));
        marketingRouter.put("/:id",this.marketingController.updateMessageTemplate.bind(this.marketingController));
        marketingRouter.post("/",this.marketingController.createMessageTempate.bind(this.marketingController));
        marketingRouter.delete("/:id",this.marketingController.deleteEmailTemplate.bind(this.marketingController));
        
        
        router.use("/message-templates", AuthMiddleware.initialize, Authorization.initialize, marketingRouter)
        router.post("/send-email", AuthMiddleware.initialize, Authorization.initialize, this.marketingController.sendEmail.bind(this.marketingController))
        

    }
}

export default MarketingRouter ;