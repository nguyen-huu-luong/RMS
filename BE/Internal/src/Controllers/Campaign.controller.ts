import { NextFunction, Request, Response } from "express";

import { CampaignService } from "../Services";
import { QueryOptions } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { ForbiddenError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";


@LogRequests
@AddTryCatchBlock
class CampaingController {
	protected campaignService: CampaignService;
	constructor() {
		this.campaignService = new CampaignService();
	}

	// "/customers/all?type=lead&firstname=fafda&age=31&page=2&pageSize=10&sort_by=asc(number)"
	public async getAllCampaign(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries = { ...req.body, ...req.query };
			const options: QueryOptions = parseRequesQueries(queries);
	
			const data = await this.campaignService.getAll(options);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
		
	}

	public async getCampaignDetails(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const id = req.params["id"]		
			const data = await this.campaignService.getById(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	public async createCampaign(req: Request, res: Response, next: NextFunction) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "create:any") {
			const campaignInfo = req.body ;
			const data = await this.campaignService.create(campaignInfo);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	
	public async updateCampaign(req: Request, res: Response, next: NextFunction) {
		if (req.action === "update:any") {
			const id = req.params["id"] ;
			const campaignInfo = req.body
			const data = await this.campaignService.update(Number(id), campaignInfo);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	// public async search(req: Request, res: Response, next: NextFunction) {}
	public async delete(req: Request, res: Response, next: NextFunction) {
		if (req.action === "delete:any") {
			const id = req.params["id"] ;
			const data = await this.campaignService.delete(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}


	public async deleteMany(req: Request, res: Response, next: NextFunction) {
		if (req.action === "delete:any") {
			const ids = req.body;
			console.log(ids)
			const data = await this.campaignService.deleteMany(ids);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}


}

export default CampaingController;
