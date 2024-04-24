import { NextFunction, Request, Response } from 'express';
import {Message} from '../Utils';
import {HttpStatusCode} from '../Constants';
import { container } from '../Configs';
import statusMess from '../Constants/statusMess';
import { ICategoryRepository } from '../Repositories/ICategoryRepository';
import { TYPES } from "../Types/type";
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />
import {
	ValidationError,
    RecordNotFoundError
} from "../Errors";

export class CategoryService {
    constructor(private categoryRepository = container.get<ICategoryRepository>(TYPES.ICategoryRepository)) {}

    public async getAll(req: Request, res: Response, next: NextFunction) {
        try {

            let sort_factor: any = req.query.sort_factor
            let order: any = req.query.order

            if (typeof sort_factor == 'undefined'){
                sort_factor = 'id'
            }

            if (typeof order == 'undefined') {
                order = 'ascend'
            }
            order = order === 'ascend' ? 'ASC' : 'DESC'

            const status: number = HttpStatusCode.Success;
            const data = await this.categoryRepository.getByCond({
                order: [
                    [sort_factor, order]
                ],
            });
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async createCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.categoryRepository.create(req.body);
            if (!data) {
				throw new RecordNotFoundError("Category do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async deleteCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const data = await this.categoryRepository.delete(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Category do not exist");
			}
            res.status(status).send(statusMess.Success);
            Message.logMessage(req, status)
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
    public async getCategory(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            console.log(req.params.id)
            const data = await this.categoryRepository.findById(parseInt(req.params.id));
            if (!data) {
				throw new RecordNotFoundError("Category do not exist");
			}
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }

    public async updateCategory(req: Request, res: Response, next: NextFunction) {
        try{
            const status: number = HttpStatusCode.Success;
            console.log(req.params.id)
            const data = await this.categoryRepository.update(Number(req.params.id), req.body);
            res.status(status).send(data);
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }


    public async getProducts(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const category = await this.categoryRepository.findById(parseInt(req.params.id));
            if (!category) {
				throw new RecordNotFoundError("Category do not exist");
			}
            res.status(status).send(await category.getProducts());
            Message.logMessage(req, status);
        }
        catch (err) {
            console.log(err)
			next(err);
        }
    }
}
