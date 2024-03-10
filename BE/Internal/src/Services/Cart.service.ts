import { NextFunction, Request, Response } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import { container } from "../Configs";
import { ICartRepository } from "../Repositories/ICartRepository";
import { IProductRepository } from "../Repositories";
import { TYPES } from "../Types/type";
import statusMess from "../Constants/statusMess";
import { RecordNotFoundError } from "../Errors";
export class CartService {
    constructor(
        private cartRepository = container.get<ICartRepository>(
            TYPES.ICartRepository
        ),
        private productRepository = container.get<IProductRepository>(
            TYPES.IProductRepository
        )
    ) {}

    public async getCart(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const cart = await this.cartRepository.getCart(req.userId);
            if (!cart) {
                throw new RecordNotFoundError("Cart do not exist");
            }
            const cartItems = await cart.getProducts({
                order: [["updatedAt", "DESC"]],
            });
            const response = {
                cart: cart.toJSON(),
                items: cartItems.map((item: any) => item.toJSON()),
            };
            Message.logMessage(req, status);
            return res.status(status).send(response);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async addProduct(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const cart = await this.cartRepository.getCart(req.userId);
            const product = await this.productRepository.findById(
                req.body.productId
            );
            if (!product) {
                throw new RecordNotFoundError("Product do not exist");
            }
            const cartItem = await cart.getProducts({
                where: { id: req.body.productId },
            });
            if (cartItem.length > 0) {
                await cart.addProduct(product, {
                    through: {
                        quantity:
                            req.body.quantity +
                            cartItem[0].CartItem.quantity,
                        amount:
                            product.getDataValue("price") *
                            (req.body.quantity +
                                cartItem[0].CartItem.quantity),
                        createdAt: cartItem[0].CartItem.createdAt,
                        updatedAt: new Date(),
                    },
                });
            } else {
                await cart.addProduct(product, {
                    through: {
                        quantity: req.body.quantity,
                        amount:
                            product.getDataValue("price") * req.body.quantity,
                        createdAt: new Date(),
                        updatedAt: new Date(),
                    },
                });
            }
            await this.updateCartDetail(cart);
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
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
            const product = await this.productRepository.findById(
                parseInt(req.params.id)
            );

            if (!product) {
                throw new RecordNotFoundError("Product do not exist");
            }
            await cart.removeProduct(product);
            await this.updateCartDetail(cart);
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
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
            const product = await this.productRepository.findById(
                req.body.productId
            );
            if (!product) {
                throw new RecordNotFoundError("Product do not exist");
            }
            const cartItem = await cart.getProducts({
                where: { id: req.body.productId },
            });
            if (req.body.quantity === 0) {
                await cart.removeProduct(product);
            } else {
                console.log("Success")
                await cart.addProduct(product, {
                    through: {
                        quantity: req.body.quantity,
                        amount:
                            product.getDataValue("price") * req.body.quantity,
                        createdAt: cartItem[0].CartItem.createdAt,
                        updatedAt: new Date(),
                    },
                });
            }
            await this.updateCartDetail(cart);
            Message.logMessage(req, status);
            return res.status(status).send(statusMess.Success);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
    public async updateCartDetail(cart: any) {
        try {
            const cartItems = await cart.getProducts();
            const totalItems = cartItems.reduce(
                (total: any, item: any) => total + item.CartItem.quantity,
                0
            );
            const totalAmount = cartItems.reduce(
                (sum: any, item: any) => sum + item.CartItem.amount,
                0
            );
            await this.cartRepository.update(cart.getDataValue("id"), {
                total: totalItems,
                amount: totalAmount,
            });
            return;
        } catch (err) {
            console.log(err);
        }
    }
}
