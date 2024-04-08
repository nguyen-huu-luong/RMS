import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { NotificationService } from "../Services";

@LogRequests
@AddTryCatchBlock
class NotificationController {
	protected notificationService: NotificationService;
	constructor() {
		this.notificationService = new NotificationService();
	}

	public async getAllNotification(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:own") {
			const data = await this.notificationService.getAll(Number(req.userId));
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
		
	}

	public async getNotificationInfo(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:own") {
			const id = req.params["id"]		
			const data = await this.notificationService.getById(Number(req.userId), Number(id));
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	public async createNotification(req: Request, res: Response, next: NextFunction) {
		if (req.action === "create:any") {
			const notificationInfo = req.body;
			const data = await this.notificationService.create(Number(req.params['id']), notificationInfo);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	public async getNumber(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:own") {
			const data = await this.notificationService.getNumber(Number(req.userId));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	public async update(req: Request, res: Response, next: NextFunction) {
		if (req.action === "update:own") {
			const id = req.params["id"]		
			const data = await this.notificationService.updateById(Number(req.userId), Number(id));
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}
}

export default NotificationController;
