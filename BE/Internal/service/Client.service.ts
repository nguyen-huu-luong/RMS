import { Request, Response } from 'express';
import message from '../define/message';
import statusCode from '../define/status';
import statusMess from '../define/statusMess';
import { container } from '../config';
import { TYPES } from '../repository/type';
import { IClientRepository } from '../repository/IClientRepository';

class ClientService {
    constructor(
        private ClientRepository = container.get<IClientRepository>(TYPES.IClientRepository)
    ) {}

    public async viewCustomers(req: Request, res: Response) {
        try {
            const status: number = statusCode.Success;
            const data = await this.ClientRepository.all();
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
            await this.ClientRepository.create(data);
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

export default ClientService;