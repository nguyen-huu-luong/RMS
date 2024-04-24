import { NextFunction, Request, Response } from "express";

import { QueryOptions, TYPES } from "../Types/type";
import { ensureDataIsValidated, ensurePermissionIsValid, parseRequesQueries } from "../Helper/helper";
import { BadRequestError, ForbiddenError, ValidationError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { EmployeeService } from "../Services";
import { TrackingService } from "../Services/Tracking.service";
import { TargetListService } from "../Services/TargetList.service";

@LogRequests
@AddTryCatchBlock
class TargetListController {
    protected targetListService: TargetListService;
    constructor() {
        this.targetListService = new TargetListService();
    }

    public async getAll(req: Request, res: Response, next: NextFunction) {
        ensurePermissionIsValid(req.action, "read:any");
        const queries = { ...req.body, ...req.query };
        const options: QueryOptions = parseRequesQueries(queries);
        console.log
        const data = await this.targetListService.getAll(options);

        res.send(data);
    }

    public async getById(req: Request, res: Response, next: NextFunction) {
        ensurePermissionIsValid(req.action, "read:any");
        const id = req.params["id"];
        const data = await this.targetListService.getById(Number(id));
        res.send(data);
    }

    public async create(req: Request, res: Response, next: NextFunction) {
        ensurePermissionIsValid(req.action, "create:any");
        ensureDataIsValidated(req)
        const data = req.body;
        const result = await this.targetListService.create(data);

        res.send(result);
    }

    public async update(req: Request, res: Response, next: NextFunction) {
        ensurePermissionIsValid(req.action, "update:any");
        const id = req.params["id"];
        const data = req.body["data"];
        console.log(data,id)
        const result = await this.targetListService.update(Number(id), data);
        res.send(result);

    }

    public async delete(req: Request, res: Response, next: NextFunction) {
        ensurePermissionIsValid(req.action, "delete:any");
        const id = req.params["id"] ;
        const data = await this.targetListService.delete(Number(id));

        res.send(data);
     }

     public async deleteMany(req: Request, res: Response, next: NextFunction) {
        console.log("fefafadfa")
        ensurePermissionIsValid(req.action, "delete:any");
        const ids = req.body["ids"] ;
        const data = await this.targetListService.deleteMany(ids);

        res.send(data);
     }
}

export default TargetListController;
