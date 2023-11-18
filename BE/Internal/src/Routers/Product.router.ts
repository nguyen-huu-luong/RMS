import ProductController from "../Controllers/Product.controller";
import { Request, Response, Router, NextFunction } from "express";
import { Authorization } from "../Middlewares/Authorization";
import { AuthMiddleware, ProductValidators } from "../Middlewares";

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
            .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.productController.deleteProduct(req, res, next)
            )
            .put(AuthMiddleware.initialize, Authorization.initialize, ProductValidators.createProductValidator, (req: Request, res: Response, next: NextFunction) =>
                this.productController.updateProduct(req, res, next)
            );
        router
            .route("/products")
            .post(AuthMiddleware.initialize, Authorization.initialize, ProductValidators.createProductValidator, (req: Request, res: Response, next: NextFunction) =>
                this.productController.createProduct(req, res, next)
            );
    }
}

export default ProductRouter;
