import { NextFunction, Request, Response } from 'express';

import { ReservationService } from '../Services';

class ReservationController {
    protected reservationService: ReservationService;

    constructor() {
        this.reservationService = new ReservationService();
    }

    public viewAllReservationsPage(req: Request, res: Response, next: NextFunction) {
        this.reservationService.viewAllReservationsPage(req, res, next)
    }

    public filterReservation(req: Request, res: Response, next: NextFunction) {
        this.reservationService.filterReservation(req, res, next)
    }

}

export default ReservationController;