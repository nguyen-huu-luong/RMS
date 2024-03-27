import { NextFunction, Request, Response } from 'express';

import { TableService } from '../Services';

class TableController {
    protected tableService: TableService;

    constructor() {
        this.tableService = new TableService();
    }

    public createTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.createTable(req, res, next)
    }

    public deleteTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.deleteTable(req, res, next)
    }

    public getTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.getTable(req, res, next)
    }

    public updateTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.updateTable(req, res, next)
    }
}

export default TableController;