import { SubscriberController } from '../Controllers';
import { NextFunction, Request, Response, Router } from 'express'

class SubscriberRouter { 
    protected subscriberController: SubscriberController;

    constructor() {
        this.subscriberController = new SubscriberController();
    }

    public initialize(router: Router) {
        router
            .route('/subscribers')
            .post((req: Request, res: Response, next: NextFunction) => this.subscriberController.createSubsciber(req, res, next))
    }
}


export default SubscriberRouter