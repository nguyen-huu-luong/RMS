import { TableController } from '../Controllers';
import { NextFunction, Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class TableRouter { 
    protected tableController: TableController;

    constructor() {
        this.tableController = new TableController();
    }

    public initialize(router: Router) {
        router.route('/tables')
        .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.createTable(req, res, next))
        .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.deleteTable(req, res, next))
    }
}


export default TableRouter