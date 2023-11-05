import express, { Application } from 'express';
import OrderRouter from './order.router';
import CustomerRouter from './customer.router';

class Router {
    public initialize(app: any) {
        const router: any = express.Router();
        const orderRouter: any = new OrderRouter();
        const customerRouter: any = new CustomerRouter();
        // declare your router here

        orderRouter.initialize(router);
        customerRouter.initialize(router);
        // initialize your router here

        app.use("", router)
    }
}

const router = new Router();

export default router;