import { Request, Response } from 'express';

import {OrderService} from "../Services";

class OrderController {
    protected orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public viewOrders(req: Request, res: Response) {
        this.orderService.viewOrders(req, res);
    }

    public createOrder(req: Request, res: Response) {
        this.orderService.createOrder(req, res);
    }

    public assignOrder(req: Request, res: Response) {
        this.orderService.assignOrder(req, res);
    }


}

export default OrderController;