import express, { Application, NextFunction, Request, Response, Router } from 'express';
import OrderRouter from './Order.router';
import CustomerRouter from './Client.router';
import AuthRouter from './Auth.router';
import { HttpStatusCode } from '../Constants';

class Routers {
    public initialize(app: Application) {
        const router = express.Router();
        const orderRouter = new OrderRouter();
        const customerRouter = new CustomerRouter();
        const authRouter = new AuthRouter() ;
        // declare your router here

        orderRouter.initialize(router);
        customerRouter.initialize(router);
        // router.use("/athe", authMiddleware.verifyToken, orderRouter.getRouter();)
        
        app.use("/auth", authRouter.initialize()) ;
        // initialize your router here
        app.use("/api/v1", router)

        
        router.all('*', (request: Request, response: Response, next: NextFunction) => {
            response.status(HttpStatusCode.NotFound).send({
                success: false,
                msg: "API Not found"
            })
        });


        
    }
}

const router = new Routers();

export default router;