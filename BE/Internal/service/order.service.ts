import { Request, Response } from 'express';
import message from '../define/message';
import OrderRepository from '../repository/order.repository';
import statusCode from '../define/status';
import statusMess from '../define/statusMess';

class OrderService {

    protected orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository();
    }

    public async viewOrders(req: Request, res: Response) {
        try {
            const status: any = statusCode.Success;
            const data = await this.orderRepository.viewOrders();
            res.status(status).send(data);
            message.logMessage(req, status);
        }
        catch (err) {
            const status: any = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async createOrder(req: Request, res: Response) {
        try {
            const status: any = statusCode.Success;
            const data: any = req.body;
            await this.orderRepository.createOrder(data);
            res.status(status).send(statusMess.Success);
            message.logMessage(req, status)
        }
        catch (err) {
            const status: any = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

    public async assignOrder(req: Request, res: Response) {
        try {
            const status: any = statusCode.Success;
            const data: any = req.body;
            await this.orderRepository.assignOrder(data);
            res.status(status).send(statusMess.Success);
            message.logMessage(req, status)
        }
        catch (err) {
            const status: any = statusCode.BadRequest;
            message.logMessage(req, status);
            res.send({ 'Err': err });
        }
    }

}

export default OrderService;