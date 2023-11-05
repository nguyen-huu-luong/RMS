import CustomerController from '../controller/customer.controller';
import { Request, Response } from 'express'

class CustomerRouter {
    protected customerController: CustomerController;

    constructor() {
        this.customerController = new CustomerController();
    }

    public initialize(router: any) {
        router.route('/customer')
            .post((req: Request, res: Response) => this.customerController.createCustomer(req, res))

        router.route('/customer/all')
            .get((req: Request, res: Response) => this.customerController.viewCustomers(req, res))
    }
}


export default CustomerRouter