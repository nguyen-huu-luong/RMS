import { Request, Response } from 'express';
import message from '../define/message';
import OrderRepository from '../repository/implementation/order.repository';
import statusCode from '../define/status';
import statusMess from '../define/statusMess';
import { container } from '../config';
import { IOrderRepository } from '../repository/IOrderRepository';
import { TYPES } from '../repository/type';

class OrderService {
    constructor(private orderRepository = container.get<IOrderRepository>(TYPES.IOrderRepository)) {}

    public async viewOrders(req: Request, res: Response) {
        try {
            const status: number = statusCode.Success;
            const data = await this.orderRepository.viewOrders();
            res.status(status).send(data);
            message.logMessage(req, status);
        }
        catch (err) {
            const status: number = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async createOrder(req: Request, res: Response) {
        try {
            const status: number = statusCode.Success;
            const data: any = req.body;
            await this.orderRepository.createOrder(data);
            res.status(status).send(statusMess.Success);
            message.logMessage(req, status)
        }
        catch (err) {
            const status: number = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async assignOrder(req: Request, res: Response) {
        try {
            const status: number = statusCode.Success;
            const data: any = req.body;
            await this.orderRepository.assignOrder(data);
            res.status(status).send(statusMess.Success);
            message.logMessage(req, status)
        }
        catch (err) {
            const status: number = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

}

export default OrderService;