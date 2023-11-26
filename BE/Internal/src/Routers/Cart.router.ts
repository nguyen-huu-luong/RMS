import CartController from "../Controllers/Cart.controller";
import { Request, Response, Router, NextFunction } from "express";
import { Authorization } from "../Middlewares/Authorization";
import { AuthMiddleware } from "../Middlewares";

class ProductRouter {
    protected cartController: CartController;

    constructor() {
        this.cartController = new CartController();
    }

    public initialize(router: Router) {
        router
            .route("/carts")
            .get(AuthMiddleware.initialize, Authorization.initialize, 
                (req: Request, res: Response, next: NextFunction) =>
                    this.cartController.getCart(req, res, next)
            )
            .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.cartController.addProduct(req, res, next)
            )
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.cartController.updateProduct(req, res, next)
            )
        router
            .route("/carts/:id")
            .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.cartController.removeProduct(req, res, next)
            )
    }
}

export default ProductRouter;
