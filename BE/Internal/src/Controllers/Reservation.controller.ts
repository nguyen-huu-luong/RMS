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

    public updateReservationStatus(req: Request, res: Response, next: NextFunction) {
        this.reservationService.updateReservationStatus(req, res, next)
    }

    public deleteReservation(req: Request, res: Response, next: NextFunction) {
        this.reservationService.deleteReservation(req, res, next)
    }

    public createReservation(req: Request, res: Response, next: NextFunction) {
        this.reservationService.createReservation(req, res, next)
    }

    public updateReservationDetail(req: Request, res: Response, next: NextFunction) {
        this.reservationService.updateReservationDetail(req, res, next)
    }

    
}

export default ReservationController;