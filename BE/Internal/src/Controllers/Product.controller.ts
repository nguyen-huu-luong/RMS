import { NextFunction, Request, Response } from 'express';

import {ProductService} from "../Services";

class ProductController {
    protected productService: ProductService;

    constructor() {
        this.productService = new ProductService();
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        this.productService.getAll(req, res, next);
    }
    public updateProduct(req: Request, res: Response, next: NextFunction) {
        this.productService.updateProduct(req, res, next);
    }
    public createProduct(req: Request, res: Response, next: NextFunction) {
        this.productService.createProduct(req, res, next);
    }
    public deleteProduct(req: Request, res: Response, next: NextFunction) {
        this.productService.deleteProduct(req, res, next);
    }
    public getProduct(req: Request, res: Response, next: NextFunction) {
        this.productService.getProduct(req, res, next);
    }

    public async getRecommendItem(req: Request, res: Response, next: NextFunction) {
        this.productService.getRecommendItem(req, res, next)
    }
}

export default ProductController;