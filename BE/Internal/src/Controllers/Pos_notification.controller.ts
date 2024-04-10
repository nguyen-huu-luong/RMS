import { NextFunction, Request, Response } from "express";

import { QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { ForbiddenError, ValidationError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { Pos_notificationService } from "../Services";

@LogRequests
@AddTryCatchBlock
class Pos_notificationController {
	protected pos_notificationService: Pos_notificationService;
	constructor() {
		this.pos_notificationService = new Pos_notificationService();
	}

	public async getAllPos_notification(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries = { ...req.body, ...req.query };
			const data = await this.pos_notificationService.getAll();
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
		
	}

	public async getPos_notificationInfo(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const id = req.params["id"]		
			const data = await this.pos_notificationService.getById(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	public async createPos_notification(req: Request, res: Response, next: NextFunction) {
		if (req.action === "create:any") {
			const pos_notificationInfo = req.body["data"] ;
			const data = await this.pos_notificationService.create(pos_notificationInfo);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}


	public async delete(req: Request, res: Response, next: NextFunction) {
		if (req.action === "delete:any") {
			const id = req.params["id"] ;
			const data = await this.pos_notificationService.delete(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}
}

export default Pos_notificationController;
