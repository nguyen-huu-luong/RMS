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
        router.route('/orders')
            .post(AuthMiddleware.initialize, Authorization.initialize,(req: Request, res: Response, next: NextFunction) => this.orderController.createOrder(req, res, next))
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.viewOrders(req, res, next))
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.updateStatus(req, res, next))

        router.route('/orders/admin')
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.viewOrders(req, res, next))
            .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.createOrder(req, res, next))
            .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.removeOrder(req, res, next))
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.updateStatus(req, res, next))

        router.route('/orders/chef')
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.updateItems(req, res, next))
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.viewItems(req, res, next))

        router.route('/orders/:id')
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.orderController.viewOrderItems(req, res, next))
        
        router.route('/orders/momo')
            .post((req: Request, res: Response, next: NextFunction)=> this.orderController.recordMoMoOrder(req, res, next))
            // .get((req: Request, res: Response)=> this.orderController.checkResultMomo(req, res))
    }
}


export default OrderRouter