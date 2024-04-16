import { NextFunction, Request, Response } from "express";

import { ClientService } from "../Services";
import { QueryOptions, TYPES } from "../Types/type";
import { ensurePermissionIsValid, parseRequesQueries } from "../Helper/helper";
import { ForbiddenError, ValidationError } from "../Errors";
import { validationResult } from "express-validator";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";

@LogRequests
@AddTryCatchBlock
class ClientController {
	protected clientService: ClientService;
	constructor() {
		this.clientService = new ClientService();
	}

	// "/customers/all?type=lead&firstname=fafda&age=31&page=2&pageSize=10&sort_by=asc(number)"
	public async getAllClient(req: Request, res: Response, next: NextFunction) {
		ensurePermissionIsValid(req.action, "read:any") ;
		const queries = { ...req.body["filter"], ...req.query };
		const options: QueryOptions = parseRequesQueries(queries);
		const data = await this.clientService.getAll(options);

		res.send(data);
	}

	public async getCustomerInfo(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const id = req.params["id"]		
			const data = await this.clientService.getById(Number(id));
			res.send(data);
		} if (req.action === "read:own"){
			const data = await this.clientService.getById(Number(req.userId));
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	public async createCustomer(req: Request, res: Response, next: NextFunction) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "create:any") {
			const customerInfo = req.body["data"] ;
			const data = await this.clientService.create(customerInfo);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	
	public async updateCustomer(req: Request, res: Response, next: NextFunction) {
		if (req.action === "update:any") {
			const id = req.params["id"] ;
			const customerInfo = req.body
			const data = await this.clientService.update(Number(id), customerInfo);
			res.send(data);
		} if (req.action === "update:own"){
			const customerInfo = req.body
			const data = await this.clientService.update(Number(req.userId), customerInfo);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	// public async search(req: Request, res: Response, next: NextFunction) {}
	public async delete(req: Request, res: Response, next: NextFunction) {
		if (req.action === "delete:any") {
			const id = req.params["id"] ;
			const data = await this.clientService.delete(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}
}

export default ClientController;
