import { Request, Response } from 'express';
import message from '../define/message';
import {CustomerRepository} from '../repository/implementation/customer.repository';
import statusCode from '../define/status';
import statusMess from '../define/statusMess';
import { container } from '../config';
import { ICustomerRepository } from '../repository/ICustomerRepository';
import { TYPES } from '../repository/type';

class CustomerService {
    constructor(
        private customerRepository = container.get<ICustomerRepository>(TYPES.ICustomerRepository)
    ) {}

    public async viewCustomers(req: Request, res: Response) {
        try {
            const status: number = statusCode.Success;
            const data = await this.customerRepository.viewCustomers();
            res.status(status).send(data);
            message.logMessage(req, status);
        }
        catch (err) {
            const status: number = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async createCustomer(req: Request, res: Response) {
        try {
            const status: number = statusCode.Success;
            const data: any = req.body;
            await this.customerRepository.createCustomer(data);
            res.status(status).send(statusMess.Success);
            message.logMessage(req, status);
        }
        catch (err) {
            const status: number = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

}

export default CustomerService;