import { NextFunction, Request, Response } from "express";

import { ClientService } from "../Services";
import { EmailService } from '../Services/Email.service';
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
	protected emailService: EmailService
	constructor() {
		this.clientService = new ClientService();
		this.emailService = new EmailService()
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
		} if (req.action === "read:own"){
			const data = await this.clientService.getById(Number(req.userId));
			res.send(data);
		} else {
			throw new ForbiddenError();
		}

	}

	public async createCustomer(req: Request, res: Response, next: NextFunction) {
		if (req.action === "create:any") {
			const customerInfo = req.body["data"];
			const data = await this.clientService.create(customerInfo);
			this.emailService.sendEmail({
                from: `${process.env.GMAIL_USER}`,
                to: req.body.email,
                subject: "Welcome to become a part of HOME CUISINE",
                html: ` <p>Hello <i>${req.body.firstname} ${req.body.lastname}</i>,</p>
                        <p style="padding-top: px;">Thank you for your interest in Home Cuisine restaurant. We are looking forward to serving you.</p> 
                        <p>Currently, we are having a lot of discounts for new client. Please visit our website or any social media channels to get more detail.</p>
                        <p style="padding-top: 6px;">Best regards,</p>
                        <p>Home Cuisine restaurant</p>
                        <div style="display: flex;">
                            <div>
                                <img style="width: 150px; height: 150px;" src="https://res.cloudinary.com/djdpobmlv/image/upload/v1712673196/General/photo-1711809068001-20dbbec35820_bfsxtm.jpg">
                            </div>
                            <div style="margin-left: 10px;">
                                <img  style="width: 150px; height: 150px;" src="https://res.cloudinary.com/djdpobmlv/image/upload/v1712673397/General/photo-1709943467017-9f4272c32b0e_lmcada.jpg">
                            </div>
                            <div style="margin-left: 10px;">
                                <img  style="width: 150px; height: 150px;" src="https://res.cloudinary.com/djdpobmlv/image/upload/v1712673752/General/photo-1577930740770-486fcbb36d69_xuxzbv.jpg">
                            </div>
                            <div style="margin-left: 10px;">
                                <img  style="width: 150px; height: 150px;" src="https://res.cloudinary.com/djdpobmlv/image/upload/v1712673159/General/photo-1712334819566-203f290516a4_budio8.jpg">
                            </div>
                            <div style="margin-left: 10px;">
                                <img  style="width: 150px; height: 150px;" src="https://res.cloudinary.com/djdpobmlv/image/upload/v1712673866/General/photo-1705917893101-f098279ebc44_sydyxu.jpg">
                            </div>
                        </div>`
            })
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}


	public async updateCustomer(req: Request, res: Response, next: NextFunction) {
		if (req.action === "update:any") {
			const id = req.params["id"];
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
			const id = req.params["id"];
			const data = await this.clientService.delete(Number(id));

			res.send(data);
		} else {
			throw new ForbiddenError();
		}

	}

	public async getOpporturnityCustomer(req: Request, res: Response, next: NextFunction) {
		try {
			if (req.action === "read:any") {
				const data = await this.clientService.getOpportunityCustomer();

				res.send(data);
			} else {
				throw new ForbiddenError();
			}
		}
		catch (err) {
			console.log(err)
		}
	}
}

export default ClientController;
