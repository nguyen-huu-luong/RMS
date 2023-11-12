import { Request, Response } from 'express';

import {ClientService} from '../Services';

class CustomerController {
    protected customerService: ClientService;

    constructor() {
        this.customerService = new ClientService();
    }

    public viewCustomers(req: Request, res: Response) {
        this.customerService.viewCustomers(req, res);
    }

    public createCustomer(req: Request, res: Response) {
        this.customerService.createCustomer(req, res);
    }
}

export default CustomerController;