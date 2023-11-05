import { Request, Response } from 'express';

import OrderService from "../service/order.service";

class OrderController {
    protected orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public viewOrders(req: Request, res: Response): any {
        this.orderService.viewOrders(req, res);
    }

    public createOrder(req: Request, res: Response): any {
        this.orderService.createOrder(req, res);
    }

    public assignOrder(req: Request, res: Response): any {
        this.orderService.assignOrder(req, res);
    }


}

export default OrderController;