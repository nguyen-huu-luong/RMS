import { GroupController } from '../Controllers';
import { NextFunction, Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class GroupRouter { 
    protected groupController: GroupController;

    constructor() {
        this.groupController = new GroupController();
    }

    public initialize(router: Router) {
        router.route('/groups/total')
        .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.groupController.getTotalPerGroup(req, res, next))
        router.route('/groups/filter')
        .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.groupController.getTotalPerGroupFilter(req, res, next))
        router.route('/groups/all')
        .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.groupController.getGroupName(req, res, next))
    }
}


export default GroupRouter