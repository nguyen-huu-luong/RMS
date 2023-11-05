import express, { Application} from 'express';
import OrderRouter from './order.router';

class Router {
    public initialize(app: any) {
        const router: any = express.Router();
        const orderRouter: any = new OrderRouter();
        orderRouter.initialize(router);
        
        app.use("", router)
    }
}

const router = new Router();

export default router;