import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    ITableRepository
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";

export class TableService {
    constructor(
        private tableRepository = container.get<ITableRepository>(
            TYPES.ITableRepository
        ),
    ) { }

    public async createTable(req: Request, res: Response, next: NextFunction) {
        try {
            const tableInfo = req.body;
            const status: number = HttpStatusCode.Success;
            if (req.action = "create:any") {
                this.tableRepository.create(tableInfo)
                res.status(status).send(statusMess.Success);
                Message.logMessage(req, status);
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }

    public async deleteTable(req: Request, res: Response, next: NextFunction) {
        try {
            if (req.action = "create:any") {
                const status: number = HttpStatusCode.Success;
                await this.tableRepository.delete(parseInt(req.params.id));
                res.status(status).send(statusMess.Success);
                Message.logMessage(req, status);
            }
            else throw new UnauthorizedError()
        }
        catch (err) {
            console.log(err);
            next(err);
        }
    }
}
