import { NextFunction, Request, Response } from 'express';

import {ChannelService} from "../Services";

class ChannelController {
    protected channelService: ChannelService;

    constructor() {
        this.channelService = new ChannelService();
    }

    public getChannel(req: Request, res: Response, next: NextFunction) {
        this.channelService.getChannel(req, res, next);
    }

    public getAdminChannel(req: Request, res: Response, next: NextFunction) {
        this.channelService.getAdminChannel(req, res, next);
    }

    public sendMessage(req: Request, res: Response, next: NextFunction) {
        this.channelService.sendMessage(req, res, next);
    }

    public adminSendMessage(req: Request, res: Response, next: NextFunction) {
        this.channelService.adminSendMessage(req, res, next);
    }
    
    public getMessages(req: Request, res: Response, next: NextFunction) {
        this.channelService.getMessages(req, res, next);
    }

    public adminGetMessages(req: Request, res: Response, next: NextFunction) {
        this.channelService.adminGetMessage(req, res, next);
    }

    public viewMessage(req: Request, res: Response, next: NextFunction) {
        this.channelService.viewMessage(req, res, next);
    }
}

export default ChannelController;