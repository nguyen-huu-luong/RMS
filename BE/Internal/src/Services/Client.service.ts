import { Request, Response } from 'express';
import message from '../Utils/Message';
import {HttpStatusCode} from '../Constants';
import statusMess from '../Constants/statusMess';
import { container } from '../Configs';
import { TYPES } from '../Repositories/type';
import { IClientRepository } from '../Repositories/IClientRepository';

export class ClientService {
    constructor(
        private ClientRepository = container.get<IClientRepository>(TYPES.IClientRepository)
    ) {}

    public async viewCustomers(req: Request, res: Response) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.ClientRepository.all();
            res.status(status).send(data);
            message.logMessage(req, status);
        }
        catch (err) {
            const status: number = HttpStatusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async createCustomer(req: Request, res: Response) {
        try {
            const status: number = HttpStatusCode.Success;
            const data: any = req.body;
            await this.ClientRepository.create(data);
            res.status(status).send(statusMess.Success);
            message.logMessage(req, status);
        }
        catch (err) {
            const status: number = HttpStatusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

}
