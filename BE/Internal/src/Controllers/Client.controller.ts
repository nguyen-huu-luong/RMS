import { NextFunction, Request, Response } from "express";

import { ClientService } from "../Services";
import { QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { ForbiddenError, ValidationError } from "../Errors";
import { validationResult } from "express-validator";

function LogRequests(target: any) {
	const originalConstructor = target;
	// Iterate through all methods in the class
	for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
		const descriptor = Object.getOwnPropertyDescriptor(
			target.prototype,
			methodName
		);

		// Check if it's a method
		if (descriptor && typeof descriptor.value === "function") {
			const originalMethod = descriptor.value;

			// Override the method with a new method that includes logging
			descriptor.value = async function (
				req: Request,
				res: Response,
				next: NextFunction
			) {
				console.log(`Incoming request to ${methodName}`);
				const url: string = req.url;
				const method: string = req.method;
				const host: string = req.headers.host as string;
				const currentDate: Date = new Date()
				let currentTime: string = currentDate.toTimeString()
				const pos: number = currentTime.indexOf('GMT')

				currentTime = currentTime.substring(0, pos - 1);
				
				console.log(`${currentTime} | ${method} ${url} ${host}`);
				// Execute the original method
				const result = await originalMethod.apply(this, [req, res, next]);

				// Log the result
				console.log(`Result of ${methodName}:`, result);
				return result;
			};

			// Apply the modified descriptor to the class prototype
			Object.defineProperty(target.prototype, methodName, descriptor);
		}
	}
}

function AddTryCatchBlock(target: any) {
	const originalConstructor = target;
	// Iterate through all methods in the class
	for (const methodName of Object.getOwnPropertyNames(target.prototype)) {
		const descriptor = Object.getOwnPropertyDescriptor(
			target.prototype,
			methodName
		);

		// Check if it's a method
		if (descriptor && typeof descriptor.value === "function") {
			const originalMethod = descriptor.value;

			descriptor.value = async function (
				req: Request,
				res: Response,
				next: NextFunction
			) {
				try {
					const result = await originalMethod.apply(this, [req, res, next]);
					return result;
				} catch (error) {
					next(error)
				}
			};
			// Apply the modified descriptor to the class prototype
			Object.defineProperty(target.prototype, methodName, descriptor);
		}
	}
}

// export interface IClientController {
// 	getAllClient(req: Request, res: Response, next: NextFunction): Promise<void>;
// }


@LogRequests
@AddTryCatchBlock
class ClientController {
	protected clientService: ClientService;
	constructor() {
		this.clientService = new ClientService();
	}

	// "/customers/all?type=lead&firstname=fafda&age=31&page=2&pageSize=10&sort_by=asc(number)"
	public async getAllClient(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries = { ...req.body, ...req.query };
			const options: QueryOptions = parseRequesQueries(queries);
	
			const data = await this.clientService.getAll(options);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
		
	}

	public async getCustomerInfo(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const id = req.params["id"]		
			const data = await this.clientService.getById(Number(id));
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	
	}

	public async createCustomer(req: Request, res: Response, next: NextFunction) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			throw new ValidationError(errors.array()[0].msg);
		}
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
