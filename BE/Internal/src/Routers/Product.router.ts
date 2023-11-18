import ProductController from "../Controllers/Product.controller";
import { Request, Response, Router, NextFunction } from "express";
import { Authorization } from "../Middlewares/Authorization";
import { AuthMiddleware } from "../Middlewares";

class ProductRouter {
    protected productController: ProductController;

    constructor() {
        this.productController = new ProductController();
    }

    public initialize(router: Router) {
        router
            .route("/products/all")
            .get((req: Request, res: Response, next: NextFunction) =>
                this.productController.getAll(req, res, next)
            );
        router
            .route("/products/:id")
            .get((req: Request, res: Response, next: NextFunction) =>
                this.productController.getProduct(req, res, next)
            )
            .delete((req: Request, res: Response, next: NextFunction) =>
                this.productController.deleteProduct(req, res, next)
            )
            .put((req: Request, res: Response, next: NextFunction) =>
                this.productController.updateProduct(req, res, next)
            );
        router
            .route("/products")
            .post((req: Request, res: Response, next: NextFunction) =>
                this.productController.createProduct(req, res, next)
            );
    }
}

export default ProductRouter;
