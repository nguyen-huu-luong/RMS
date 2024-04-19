import { FloorController } from '../Controllers';
import { NextFunction, Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class FloorRouter { 
    protected floorController: FloorController;

    constructor() {
        this.floorController = new FloorController();
    }

    public initialize(router: Router) {
        router.route('/floors/all')
        .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.floorController.createFloor(req, res, next))
        .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.floorController.deleteFloor(req, res, next))
    }
}


export default FloorRouter