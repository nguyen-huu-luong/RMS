import { NextFunction, Request, Response } from 'express';

import {CartService} from "../Services";

class CartController {
    protected cartService: CartService;

    constructor() {
        this.cartService = new CartService();
    }

    public getCart(req: Request, res: Response, next: NextFunction) {
        this.cartService.getCart(req, res, next);
    }
    public addProduct(req: Request, res: Response, next: NextFunction) {
        this.cartService.addProduct(req, res, next);
    }
    public removeProduct(req: Request, res: Response, next: NextFunction) {
        this.cartService.removeProduct(req, res, next);
    }
    public updateProduct(req: Request, res: Response, next: NextFunction) {
        this.cartService.updateProduct(req, res, next);
    }
    public getCartItems(req: Request, res: Response, next: NextFunction) {
        this.cartService.getCartItems(req, res, next);
    }


}

export default CartController;