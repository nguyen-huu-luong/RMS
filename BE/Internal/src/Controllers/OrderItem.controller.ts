import { NextFunction, Request, Response } from 'express';

import {OrderItemService} from "../Services";

class OrderItemController {
    protected orderItemService: OrderItemService;

    constructor() {
        this.orderItemService = new OrderItemService();
    }

    public getBestSeller(req: Request, res: Response, next: NextFunction) {
        this.orderItemService.getBestSeller(req, res, next)
    }

}

export default OrderItemController;