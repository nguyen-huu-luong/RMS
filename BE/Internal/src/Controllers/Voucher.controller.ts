import { NextFunction, Request, Response } from 'express';

import {VoucherService} from "../Services";

class VoucherController {
    protected voucherService: VoucherService;

    constructor() {
        this.voucherService = new VoucherService();
    }

    public getAll(req: Request, res: Response, next: NextFunction) {
        this.voucherService.getAll(req, res, next);
    }
    public updateVoucher(req: Request, res: Response, next: NextFunction) {
        this.voucherService.updateVoucher(req, res, next);
    }
    public createVoucher(req: Request, res: Response, next: NextFunction) {
        this.voucherService.createVoucher(req, res, next);
    }
    public deleteVoucher(req: Request, res: Response, next: NextFunction) {
        this.voucherService.deleteVoucher(req, res, next);
    }
    public getVoucher(req: Request, res: Response, next: NextFunction) {
        this.voucherService.getVoucher(req, res, next);
    }
    public assignVouchers(req: Request, res: Response, next: NextFunction) {
        this.voucherService.assignVouchers(req, res, next);
    }
    public consumeVoucher(req: Request, res: Response, next: NextFunction) {
        this.voucherService.consumeVoucher(req, res, next);
    }

}

export default VoucherController;