import { NextFunction, Request, Response } from "express";

import { ClientService } from "../Services";
import { QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { BadRequestError, ForbiddenError } from "../Errors";
import { MarketingService } from "../Services/Marketing.service";

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

@LogRequests
@AddTryCatchBlock
class MarketingController {
	protected marketingService: MarketingService;
	constructor() {
		this.marketingService = new MarketingService();
	}

	// "/customers/all?type=lead&firstname=fafda&age=31&page=2&pageSize=10&sort_by=asc(number)"
	public async getAllTemplate(req: Request, res: Response, next: NextFunction) {
    
        if (req.action === "read:any") {
			const queries = { ...req.body, ...req.query };
			const options: QueryOptions = parseRequesQueries(queries);
	
			const data = await this.marketingService.getAllMessageTemplates(options);
	
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

    public async createMessageTempate(req: Request, res: Response, next: NextFunction) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "create:any") {
			const {data} = req.body ;
			const result = await this.marketingService.createMessageTempplate(data );
	
			res.send(result);
		} else {
			throw new ForbiddenError();
		}
	}
}
export default MarketingController;
