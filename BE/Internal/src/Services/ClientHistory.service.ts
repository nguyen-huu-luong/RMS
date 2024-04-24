import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    IClientHistoryRepository
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";
import { where } from "sequelize";

export class ClientHistoryService {
    constructor(
        private clientHistoryRepository = container.get<IClientHistoryRepository>(
            TYPES.IClientHistoryRepository
        ),
    ) { }

    public async create(req: Request, res: Response, next: NextFunction) {
        const data: any = req.body;
        const client_id = req.userId
        const history =  await this.clientHistoryRepository.create({...data, clientId: client_id})
        res.send(history)
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        const histories = await this.clientHistoryRepository.findByCond({
            where: {
                clientId: req.params.id
            },
            order: [
                ['createdAt', "DESC"]
            ]
        })
        res.send(histories)
    }
}
