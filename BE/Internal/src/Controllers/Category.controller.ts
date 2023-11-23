import { NextFunction, Request, Response } from 'express';

import {CategoryService} from "../Services";

class CategoryController {
    protected categoryService: CategoryService;

    constructor() {
        this.categoryService = new CategoryService();
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        this.categoryService.getAll(req, res, next);
    }
    public createCategory(req: Request, res: Response, next: NextFunction) {
        this.categoryService.createCategory(req, res, next);
    }
    public deleteCategory(req: Request, res: Response, next: NextFunction) {
        this.categoryService.deleteCategory(req, res, next);
    }
    public getCategory(req: Request, res: Response, next: NextFunction) {
        this.categoryService.getCategory(req, res, next);
    }
    public getProducts(req: Request, res: Response, next: NextFunction) {
        this.categoryService.getProducts(req, res, next);
    }

}

export default CategoryController;