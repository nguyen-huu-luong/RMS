import { NextFunction, Request, Response } from "express";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import JobService from "../Services/JobService";
import { QUEUE_NAMES } from "../Services/Queue.service";

@LogRequests
@AddTryCatchBlock
class JobController {
    private jobService: JobService
    constructor() {
        this.jobService = new JobService()
    }
    public async getAllJob(req: Request, res: Response, next: NextFunction) {
        const result = await this.jobService.getAll(QUEUE_NAMES.DEFAULT)
        res.send(result)
    }
}

export  default JobController