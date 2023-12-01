import VoucherController from "../Controllers/Voucher.controller";
import { Request, Response, Router, NextFunction } from "express";
import { Authorization } from "../Middlewares/Authorization";
import { AuthMiddleware } from "../Middlewares";

class VoucherRouter {
    protected voucherController: VoucherController;

    constructor() {
        this.voucherController = new VoucherController();
    }

    public initialize(router: Router) {
        router
            .route("/vouchers/all")
            .get(AuthMiddleware.initialize, Authorization.initialize,(req: Request, res: Response, next: NextFunction) =>
                this.voucherController.getAll(req, res, next)
            );
        router
            .route("/vouchers/:id")
            .get(AuthMiddleware.initialize, Authorization.initialize,(req: Request, res: Response, next: NextFunction) =>
                this.voucherController.getVoucher(req, res, next)
            )
            .post(AuthMiddleware.initialize, Authorization.initialize,(req: Request, res: Response, next: NextFunction) =>
                this.voucherController.assignVouchers(req, res, next)
            )
            .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.voucherController.deleteVoucher(req, res, next)
            )
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.voucherController.updateVoucher(req, res, next)
            )
            .patch(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.voucherController.consumeVoucher(req, res, next)
            );
        router
            .route("/vouchers")
            .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.voucherController.createVoucher(req, res, next)
            );
    }
}

export default VoucherRouter;
