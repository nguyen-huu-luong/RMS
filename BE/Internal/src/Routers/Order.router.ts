import OrderController from '../Controllers/Order.controller';
import { Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class OrderRouter {
    protected orderController: OrderController;

    constructor() {
        this.orderController = new OrderController();
    }

    public initialize(router: Router) {
        router.route('/order/all')
            .get(AuthMiddleware.initialize,Authorization.initialize, (req: Request, res: Response) => this.orderController.viewOrders(req, res))

        router.route('/order')
            .post((req: Request, res: Response) => this.orderController.createOrder(req, res))
            .put((req: Request, res: Response) => this.orderController.assignOrder(req, res))

        // add some routes related to order here
    }
}


export default OrderRouter