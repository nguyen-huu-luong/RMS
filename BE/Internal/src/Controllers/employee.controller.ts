import { NextFunction, Request, Response } from "express";

import { QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { ForbiddenError, ValidationError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { EmployeeService } from "../Services";

@LogRequests
@AddTryCatchBlock
class ClientController {
	protected employeeService: EmployeeService;
	constructor() {
		this.employeeService = new EmployeeService();
	}

	// "/customers/all?type=lead&firstname=fafda&age=31&page=2&pageSize=10&sort_by=asc(number)"
	public async getAllEmployee(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries = { ...req.body, ...req.query };
			const options: QueryOptions = parseRequesQueries(queries);
	
			const data = await this.employeeService.getAll(options);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
		
	}

	public async getEmployeeInfo(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const id = req.params["id"]		
			const data = await this.employeeService.getById(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	public async createEmployee(req: Request, res: Response, next: NextFunction) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "create:any") {
			const employeeInfo = req.body["data"] ;
            console.log(employeeInfo)
			const data = await this.employeeService.create({...employeeInfo, gender: 1,birthday: new Date(), role: "employee" });
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	
	public async updateEmployee(req: Request, res: Response, next: NextFunction) {
		if (req.action === "update:any") {
			const id = req.params["id"] ;
			const customerInfo = req.body
			const data = await this.employeeService.update(Number(id), customerInfo);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	// public async search(req: Request, res: Response, next: NextFunction) {}
	public async delete(req: Request, res: Response, next: NextFunction) {
		if (req.action === "delete:any") {
			const id = req.params["id"] ;
			const data = await this.employeeService.delete(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}
}

export default ClientController;
