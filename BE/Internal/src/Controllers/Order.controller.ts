import { Request, Response, NextFunction } from 'express';

import {OrderService, MoMoService} from "../Services";

class OrderController {
    protected orderService: OrderService;
    protected momoService: MoMoService;

    constructor() {
        this.orderService = new OrderService();
        this.momoService = new MoMoService();
    }

    public viewOrderItems(req: Request, res: Response, next:NextFunction) {
        this.orderService.viewOrderItems(req, res, next);
    }

    public viewOrders(req: Request, res: Response, next:NextFunction) {
        this.orderService.viewOrders(req, res, next);
    }

    public createOrder(req: Request, res: Response, next:NextFunction) {
        const payMethod = req.query.method
        if(payMethod == "CASH") {
            this.orderService.createOrder(req, res, next);
        }
        else{
            this.momoService.payWithMethod(req, res, next);
        }
    }

    public removeOrder(req: Request, res: Response, next:NextFunction) { 
        this.orderService.removeOrder(req, res, next);
    }

    public updateStatus(req: Request, res: Response, next:NextFunction) { 
        this.orderService.updateStatus(req, res, next);
    }

    public recordMoMoOrder(req: Request, res: Response, next: NextFunction) {
        this.orderService.recordMoMoOrder(req, res, next);
    }

    public updateItems(req: Request, res: Response, next:NextFunction) { 
        this.orderService.updateItems(req, res, next);
    }

    public viewItems(req: Request, res: Response, next: NextFunction) {
        this.orderService.viewItems(req, res, next);
    }

}

export default OrderController;