import { NextFunction, Request, Response } from 'express';

import {ClientHistoryService} from "../Services";

class ClientHistoryController {
    protected clientHistoryService: ClientHistoryService;

    constructor() {
        this.clientHistoryService = new ClientHistoryService();
    }

    public create(req: Request, res: Response, next: NextFunction) {
        this.clientHistoryService.create(req, res, next)
    }

    public getById(req: Request, res: Response, next: NextFunction) {
        this.clientHistoryService.getById(req, res, next)
    }
}

export default ClientHistoryController;