import { ReportController } from "../Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";

// @injectable()
class ReportRouter {
    protected ReportController: ReportController;
    constructor() {
        this.ReportController = new ReportController();
    }

    public initialize(router: Router) {
        const reportRouter = Router();
        reportRouter.get("/statistics",this.ReportController.getProfit.bind(this.ReportController));
        reportRouter.get("/charts",this.ReportController.getChart.bind(this.ReportController));
        reportRouter.get("/products",this.ReportController.getProductChart.bind(this.ReportController));
        reportRouter.get("/customers",this.ReportController.getCustomerChart.bind(this.ReportController));
        reportRouter.get("/leads",this.ReportController.getLeadChart.bind(this.ReportController));

        router.use("/reports", AuthMiddleware.initialize, Authorization.initialize, reportRouter);
    }
}

export default ReportRouter;
