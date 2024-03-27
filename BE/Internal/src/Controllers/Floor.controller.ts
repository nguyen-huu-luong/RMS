import { NextFunction, Request, Response } from 'express';

import { FloorService } from '../Services';

class FloorController {
    protected floorService: FloorService;

    constructor() {
        this.floorService = new FloorService();
    }

    public createFloor(req: Request, res: Response, next: NextFunction) {
        this.floorService.createFloor(req, res, next)
    }

    public deleteFloor(req: Request, res: Response, next: NextFunction) {
        this.floorService.deleteFloor(req, res, next)
    }

}

export default FloorController;