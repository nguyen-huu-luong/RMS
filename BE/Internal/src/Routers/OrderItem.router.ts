import OrderItemController from "../Controllers/OrderItem.controller";
import { Request, Response, Router, NextFunction } from "express";

class OrderItemRouter {
    protected orderItemController: OrderItemController;

    constructor() {
        this.orderItemController = new OrderItemController();
    }

    public initialize(router: Router) {
        router
            .route("/orderitems/bestseller")
                .get((req: Request, res: Response, next: NextFunction) => this.orderItemController.getBestSeller(req, res, next))
    }
}

export default OrderItemRouter;
