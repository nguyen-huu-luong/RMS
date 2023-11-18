import OrderController from '../Controllers/Order.controller';
import { NextFunction, Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class OrderRouter { 
    protected orderController: OrderController;

    constructor() {
        this.orderController = new OrderController();
    }

    public initialize(router: Router) {
        router.route('/orders/all')
            .get((req: Request, res: Response, next: NextFunction) => this.orderController.viewOrders(req, res, next))
        router.route('/orders/:id')
            .delete((req: Request, res: Response, next: NextFunction) => this.orderController.removeOrder(req, res, next))
        router.route('/orders')
            .post((req: Request, res: Response, next: NextFunction) => this.orderController.createOrder(req, res, next))
            .put((req: Request, res: Response, next: NextFunction) => this.orderController.updateStatus(req, res, next))
    }
}


export default OrderRouter