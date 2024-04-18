import { container } from "../Configs";
import { ClientController } from "../Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";
import CampaingController from "../Controllers/Campaign.controller";
import { CampaignValidator } from "../Middlewares/Validators/CampaignValidator";

// @injectable()
class CampaignRouter {
    constructor() {
    }
    
    public initialize(router: Router) {
        const campaignController = new CampaingController();
        const campaignRouter = Router();
        campaignRouter.get("/all",campaignController.getAllCampaign.bind(campaignController));
        campaignRouter.get("/:id", campaignController.getCampaignDetails.bind(campaignController));
        campaignRouter.post("",CampaignValidator.createCampaignValidator, campaignController.createCampaign.bind(campaignController));
        campaignRouter.put("/:id", campaignController.updateCampaign.bind(campaignController));
        campaignRouter.delete("/", campaignController.deleteMany.bind(campaignController));
        campaignRouter.delete("/:id", campaignController.delete.bind(campaignController));

        router.use("/campaigns", AuthMiddleware.initialize, Authorization.initialize, campaignRouter);
    }
}

export default CampaignRouter;
