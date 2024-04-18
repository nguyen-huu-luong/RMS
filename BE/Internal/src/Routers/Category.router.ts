import CategoryController from "../Controllers/Category.controller";
import { Request, Response, Router, NextFunction } from "express";
import { Authorization } from "../Middlewares/Authorization";
import { AuthMiddleware } from "../Middlewares";

class CategoryRouter {
    protected categoryController: CategoryController;

    constructor() {
        this.categoryController = new CategoryController();
    }

    public initialize(router: Router) {
        router
            .route("/categories/all")
            .get((req: Request, res: Response, next: NextFunction) =>
                this.categoryController.getAll(req, res, next)
            );
        router
            .route("/categories/:id")
            .get((req: Request, res: Response, next: NextFunction) =>
                this.categoryController.getProducts(req, res, next)
            )
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
            this.categoryController.updateCategory(req, res, next)
        )
            .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.categoryController.deleteCategory(req, res, next)
            )
        router
            .route("/categories")
            .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) =>
                this.categoryController.createCategory(req, res, next)
            );
    }
}

export default CategoryRouter;
