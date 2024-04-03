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
        .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.getTable(req, res, next))
        .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.createTable(req, res, next))
        .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.deleteTable(req, res, next))
        .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.updateTable(req, res, next))

        router.route('/tables/cart/:id')
        .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.getCartItems(req, res, next))
        .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.addtoCart(req, res, next))
        .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.tableController.updateCart(req, res, next))
    }
}


export default TableRouter