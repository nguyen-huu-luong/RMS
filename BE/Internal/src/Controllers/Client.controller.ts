import { NextFunction, Request, Response } from "express";

import { ClientService } from "../Services";
import { EmailService } from '../Services/Email.service';
import { QueryOptions, TYPES } from "../Types/type";
import { ensurePermissionIsValid, parseRequesQueries } from "../Helper/helper";
import { ForbiddenError, ValidationError } from "../Errors";
import { validationResult } from "express-validator";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";

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
		ensurePermissionIsValid(req.action, "read:any");
		const queries = { ...req.body["filter"], ...req.query };

		if (!req.query["type"] || req.query["type"] === "customer") {
			queries.type = "customer"
		} else if (req.query["type"] === "lead") {
			queries.type = "lead"
		}
		const options: QueryOptions = parseRequesQueries(queries);
		const data = await this.clientService.getAll(options);

		res.send(data);
	}

	public async getClientInfo(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const id = req.params["id"]
			const data = await this.clientService.getById(Number(id));
			res.send(data);
		} if (req.action === "read:own") {
			const data = await this.clientService.getById(Number(req.userId));
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	public async createClient(req: Request, res: Response, next: NextFunction) {
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


	public async updateClient(req: Request, res: Response, next: NextFunction) {
		if (req.action === "update:any") {
			const id = req.params["id"];
			const customerInfo = req.body
			const data = await this.clientService.update(Number(id), customerInfo);
			res.send(data);
		} if (req.action === "update:own") {
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
				let sort_factor: any = req.query.sort_factor
				let order: any = req.query.order

				if (typeof sort_factor == 'undefined') {
					sort_factor = 'amount'
				}

				if (typeof order == 'undefined') {
					order = 'ascend'
				}
				order = order === 'ascend' ? 'ASC' : 'DESC'

				const data = await this.clientService.getOpportunityCustomer(sort_factor, order);

				res.send(data);
			} else {
				throw new ForbiddenError();
			}
		}
		catch (err) {
			console.log(err)
		}
	}

	public async segmentCustomerAll(req: Request, res: Response, next: NextFunction) {
		try {
			if (req.action === "create:any") {
				const data = await this.clientService.segmentCustomerAll()
				res.send(data)
			}
			else {
				throw new ForbiddenError();
			}
		}
		catch (err) {
			console.log(err)
		}
	}

	public async segmentCustomer(req: Request, res: Response, next: NextFunction) {
		try {
			if (req.action === "create:any") {
				const data = await this.clientService.segmentCustomer(Number(req.params.id))
				res.send(data)
			}
			else {
				throw new ForbiddenError();
			}
		}
		catch (err) {
			console.log(err)
		}
	}

	public async getCustomerPerGroup(req: Request, res: Response, next: NextFunction) {
		try {

			let groupIds: any = req.query.groupIds
			let array_ids: any = []
			if (typeof groupIds == 'undefined') {}
			else {
				groupIds = groupIds.substring(1, groupIds.length - 1)
				const array_str_ids = groupIds.split(',')
				array_ids = array_str_ids.map((item: any) => {
					return Number(item)
				})
			}
			const data = await this.clientService.getCustomerPerGroup(array_ids)
			res.send(data)

		}
		catch (err) {
			console.log(err)
		}
	}
}

export default ClientController;
