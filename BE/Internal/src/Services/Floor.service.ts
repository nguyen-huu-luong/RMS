import { Request, Response, NextFunction } from "express";
import { Message } from "../Utils";
import { HttpStatusCode } from "../Constants";
import statusMess from "../Constants/statusMess";
import { container } from "../Configs";
import {
    IFloorRepository
} from "../Repositories";
import { TYPES } from "../Types/type";
import { RecordNotFoundError, UnauthorizedError } from "../Errors";

export class FloorService {
    constructor(
        private floorRepository = container.get<IFloorRepository>(
            TYPES.IFloorRepository
        ),
    ) { }

    public async createFloor(req: Request, res: Response, next: NextFunction) {
        try {
            const status: number = HttpStatusCode.Success;
            const floorInfo = req.body;
            if (req.action = "create:any") {
                this.floorRepository.create(floorInfo)
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
                await this.floorRepository.delete(parseInt(req.params.id));
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
