import { ClientHistoryController } from '../Controllers';
import { NextFunction, Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class ClientHistoryRouter { 
    protected clientHistoryController: ClientHistoryController;

    constructor() {
        this.clientHistoryController = new ClientHistoryController();
    }

    public initialize(router: Router) {
        router.route('/clienthistories')
        .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.clientHistoryController.create(req, res, next))
        router.route('/clienthistories/:id')
        .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.clientHistoryController.getById(req, res, next))
    }
}


export default ClientHistoryRouter