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
        router.route('/reservations/all')
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.viewAllReservationsPage(req, res, next))
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.updateReservationDetail(req, res, next))

        router.route('/reservations/detail')
            .get(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.filterReservation(req, res, next))
            .put(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.updateReservationStatus(req, res, next))
            .delete(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.deleteReservation(req, res, next))
            .post(AuthMiddleware.initialize, Authorization.initialize, (req: Request, res: Response, next: NextFunction) => this.reservationController.createReservation(req, res, next))
    }
}


export default ReservationRouter