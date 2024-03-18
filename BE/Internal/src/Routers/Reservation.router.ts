import { ReservationController } from '../Controllers';
import { NextFunction, Request, Response, Router } from 'express'
import { Authorization } from '../Middlewares/Authorization';
import { AuthMiddleware } from '../Middlewares';

class ReservationRouter { 
    protected reservationController: ReservationController;

    constructor() {
        this.reservationController = new ReservationController();
    }

    public initialize(router: Router) {
        router.route('/reservations')
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.viewAllReservationsPage(req, res, next))
    }
}


export default ReservationRouter