import { Request, Response, NextFunction } from 'express';

import {OrderService} from "../Services";

class OrderController {
    protected orderService: OrderService;

    constructor() {
        this.orderService = new OrderService();
    }

    public viewOrderItems(req: Request, res: Response, next:NextFunction) {
        this.orderService.viewOrderItems(req, res, next);
    }

    public viewOrders(req: Request, res: Response, next:NextFunction) {
        this.orderService.viewOrders(req, res, next);
    }

    public createOrder(req: Request, res: Response, next:NextFunction) {
        this.orderService.createOrder(req, res, next);
    }

    public removeOrder(req: Request, res: Response, next:NextFunction) { 
        this.orderService.removeOrder(req, res, next);
    }

    public updateStatus(req: Request, res: Response, next:NextFunction) { 
        this.orderService.updateStatus(req, res, next);
    }
}

export default OrderController;