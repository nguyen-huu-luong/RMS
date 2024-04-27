import { NextFunction, Request, Response } from 'express';

import { GroupService, ClientService } from '../Services';

class GroupController {
    protected groupService: GroupService;
    protected clientService: ClientService;

    constructor() {
        this.groupService = new GroupService();
        this.clientService = new ClientService();
    }

    public async getTotalPerGroup(req: Request, res: Response, next: NextFunction) {
        const data =  await this.clientService.getTotalPerGroup()
        res.send(data)
    }

    public async getTotalPerGroupFilter(req: Request, res: Response, next: NextFunction){
        let groups: any
        if(req.query.type == "Customize") {
            const start_date = String(req.query.start_date) 
            const end_date = String(req.query.end_date) 
            if (start_date > end_date) {
                res.send("Start date must be less than or equal to end date")
                return
            }
            groups =  await this.clientService.getTotalPerGroupFilter(req.query.type, {start_date: start_date, end_date: end_date})
        }
        else {
            groups =  await this.clientService.getTotalPerGroupFilter(String(req.query.type))
        }
        res.send(groups)
    }

    public async getGroupName(req: Request, res: Response, next: NextFunction){
        const groups = await this.groupService.getAllGroup(req, res, next)
        res.send(groups)

    }

}

export default GroupController;