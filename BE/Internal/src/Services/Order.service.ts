import { Request, Response } from 'express';
import {Message} from '../Utils/';
import {HttpStatusCode} from '../Constants';
import statusMess from '../Constants/statusMess';
import { container } from '../Configs';
import { IOrderRepository } from '../Repositories/IOrderRepository';
import { TYPES } from '../Repositories/type';

export class OrderService {
    constructor(private orderRepository = container.get<IOrderRepository>(TYPES.IOrderRepository)) {}

    public async viewOrders(req: Request, res: Response) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.orderRepository.viewOrders();
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            const status: number = HttpStatusCode.BadRequest;
            Message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async createOrder(req: Request, res: Response) {
        try {
            const status: number = HttpStatusCode.Success;
            const data: any = req.body;
            await this.orderRepository.createOrder(data);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            const status: number = HttpStatusCode.BadRequest;
            Message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async assignOrder(req: Request, res: Response) {
        try {
            const status: number = HttpStatusCode.Success;
            const data: any = req.body;
            await this.orderRepository.assignOrder(data);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            const status: number = HttpStatusCode.BadRequest;
            Message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

}
