import { Request, Response } from 'express';

import OrderService from "../service/order.service";

class OrderController {
    protected static orderService: any = new OrderService;

    public viewOrder(req: Request, res: Response): any {
        OrderController.orderService.viewOrder(req, res);
    }

    public createOrder(req: Request, res: Response): any {
        OrderController.orderService.createOrder();
    }

    public updateOrder(req: Request, res: Response): any {
        OrderController.orderService.updateOrder();
    }

    public deleteOrder(req: Request, res: Response) {
        OrderController.orderService.deleteOrder();
    }
}

export default OrderController;