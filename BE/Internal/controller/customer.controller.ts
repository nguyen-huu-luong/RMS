import { Request, Response } from 'express';

import CustomerService from '../service/Client.service';

class CustomerController {
    protected customerService: CustomerService;

    constructor() {
        this.customerService = new CustomerService();
    }

    public viewCustomers(req: Request, res: Response) {
        this.customerService.viewCustomers(req, res);
    }

    public createCustomer(req: Request, res: Response) {
        this.customerService.createCustomer(req, res);
    }
}

export default CustomerController;