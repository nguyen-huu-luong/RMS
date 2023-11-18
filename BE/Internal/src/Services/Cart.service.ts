import { NextFunction, Request, Response } from 'express';
import {Message} from '../Utils';
import {HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import { ICartRepository } from '../Repositories/ICartRepository';
import { TYPES } from '../Repositories/type';
import statusMess from '../Constants/statusMess';
import { RecordNotFoundError } from '../Errors';
export class CartService {
    constructor(private cartRepository = container.get<ICartRepository>(TYPES.ICartRepository)) {}

    public async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.cartRepository.findById(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Cart do not exist");
			}
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.cartRepository.addProduct(req.body);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async removeProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.cartRepository.removeProduct(req.body);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async updateProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.cartRepository.updateProduct(req.body);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async getCartItems(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.cartRepository.getCartItems(req.body);
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
}
