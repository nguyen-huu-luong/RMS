import { NextFunction, Request, Response } from 'express';

import { TableService, MoMoService } from '../Services';

class TableController {
    protected tableService: TableService;
    protected momoService: MoMoService;

    constructor() {
        this.tableService = new TableService();
        this.momoService = new MoMoService()
    }

    public createTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.createTable(req, res, next)
    }

    public deleteTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.deleteTable(req, res, next)
    }

    public getTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.getTable(req, res, next)
    }

    public updateTable(req: Request, res: Response, next: NextFunction) {
        this.tableService.updateTable(req, res, next)
    }

    public getCartItems(req: Request, res: Response, next: NextFunction) {
        this.tableService.getCartItems(req, res, next)
    }

    public addtoCart(req: Request, res: Response, next: NextFunction){
        this.tableService.addToCart(req, res, next)
    }

    public updateCart(req: Request, res: Response, next: NextFunction){
        this.tableService.updateCart(req, res, next)
    }

    public makePayment(req: Request, res: Response, next: NextFunction){
        const data = req.body
        const { pay_method, ...client_data } = data
        if (pay_method == "CASH"){
            this.tableService.makePayment(req, res, next)
        }
        else{
            this.momoService.captureWallet(req, res, next)
        }
    }

}

export default TableController;