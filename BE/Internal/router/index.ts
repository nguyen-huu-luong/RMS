import express, { Application, Router } from 'express';
import OrderRouter from './order.router';
import CustomerRouter from './customer.router';

class Routers {
    public initialize(app: Application) {
        const router: Router = express.Router();
        const orderRouter: OrderRouter = new OrderRouter();
        const customerRouter: CustomerRouter = new CustomerRouter();
        // declare your router here

        orderRouter.initialize(router);
        customerRouter.initialize(router);
        // initialize your router here

        app.use("/api/v1", router)
    }
}

const router = new Routers();

export default router;