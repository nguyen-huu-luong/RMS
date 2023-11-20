import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import { ICartRepository } from "../Repositories/ICartRepository";
import { ICartItemRepository } from "../Repositories/ICartItemRepository";
import { IProductRepository } from "../Repositories";
import { TYPES } from "../Repositories/type";
import statusMess from "../Constants/statusMess";
import { RecordNotFoundError } from "../Errors";
export class CartService {
    constructor(
        private cartRepository = container.get<ICartRepository>(
            TYPES.ICartRepository
        ),
        private cartItemRepository = container.get<ICartItemRepository>(
            TYPES.ICartItemRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        )
    ) {}

    public async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.cartRepository.getCart(req.userId);
            if (!data) {
                throw new RecordNotFoundError("Cart do not exist");
            }
            res.status(status).send(data);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const cart = await this.cartRepository.getCart(req.userId);
            const cartId = cart?.getDataValue("id");
            const product = await this.productRepository.findById(
                req.body.productId
            );
            if (!product) {
                throw new RecordNotFoundError("Product do not exist");
            }
            const cartItem = await this.cartItemRepository.createItem({
                cartId: cartId,
                productId: req.body.productId,
                quantity: req.body.quantity,
                price: product.getDataValue("price"),
            });
            await this.updateCartDetail(cartId);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async removeProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const cart = await this.cartRepository.getCart(req.userId);
            const cartId = cart?.getDataValue("id");
            const product = await this.productRepository.findById(
                req.body.productId
            );
            if (!product) {
                throw new RecordNotFoundError("Product do not exist");
            }
            await this.cartItemRepository.deleteOne(cartId, req.body.productId);
            await this.updateCartDetail(cartId);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async updateProduct(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const status: number = HttpStatusCode.Success;
            const cart = await this.cartRepository.getCart(req.userId);
            const cartId = cart?.getDataValue("id");
            const product = await this.productRepository.findById(
                req.body.productId
            );
            if (!product) {
                throw new RecordNotFoundError("Product do not exist");
            }
            if (req.body.quantity === 0) {
                await this.cartItemRepository.deleteOne(
                    cartId,
                    req.body.productId
                );
            } else {
                await this.cartItemRepository.updateOne(
                    cartId,
                    req.body.productId,
                    {
                        amount: req.body.quantity * product?.getDataValue("price"),
                        quantity: req.body.quantity,
                    }
                );
            }
            await this.updateCartDetail(cartId);
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async getCartItems(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const cart = await this.cartRepository.getCart(req.userId);
            const cartItems = await this.cartItemRepository.getAll(cart.getDataValue('id'))
            res.status(status).send(cartItems);
            Message.logMessage(req, status);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async updateCartDetail(cartId: number) {
        try {
            const cartItems = await this.cartItemRepository.getAll(cartId);
            const totalItems = cartItems.reduce(
                (total: any, cartItems: any) =>
                    total + cartItems.getDataValue("quantity"),
                0
            );
            const totalAmount = cartItems.reduce(
                (sum: any, cartItems: any) =>
                    sum + cartItems.getDataValue("amount"),
                0
            );
            await this.cartRepository.update(cartId, {
                total: totalItems,
                amount: totalAmount,
            });
            return;
        } catch (err) {
            console.log(err);
        }
    }
}
