import { Request, Response } from 'express';
import message from '../define/message';

class OrderService {
    public viewOrder(req: Request, res: Response) {
        res.send("View order");
        message.logMessage(req, 200);
    }

    public createOrder() {
        console.log("Create order");
    }

    public updateOrder() {
        console.log("Update order");
    }

    public deleteOrder() {
        console.log("Delete order");
    }

}

export default OrderService;