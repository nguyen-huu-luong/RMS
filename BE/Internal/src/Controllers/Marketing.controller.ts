import { NextFunction, Request, Response } from "express";

import { CampaignService, ClientService } from "../Services";
import { QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { BadRequestError, ForbiddenError } from "../Errors";
import { MarketingService } from "../Services/Marketing.service";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { EmailService } from "../Services/Email.service";
import { MailOptions } from "nodemailer/lib/json-transport";

@LogRequests
@AddTryCatchBlock
class MarketingController {
	protected marketingService: MarketingService;
	protected emailService: EmailService;
	protected campaignService: CampaignService ;
	constructor() {
		this.marketingService = new MarketingService();
		this.emailService = new EmailService();
		this.campaignService = new CampaignService() ;
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

	public async getTemplateInfo(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		if (req.action === "read:any") {
			const id = req.params["id"];
			const data = await this.marketingService.getById(Number(id));

			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

	public async createMessageTempate(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "create:any") {
			const { name, description, content, type } = req.body;
			const result = await this.marketingService.createMessageTempplate({
				name,
				description,
				content,
				type,
			});

			

			res.send(result);
		} else {
			throw new ForbiddenError();
		}
	}

	public async updateMessageTemplate(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "update:any") {
			const data = req.body;
			const result = await this.marketingService.update(data, req.params["id"]);

			res.send(result);
		} else {
			throw new ForbiddenError();
		}
	}

	public async deleteEmailTemplate(
		req: Request,
		res: Response,
		next: NextFunction
	) {
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	throw new ValidationError(errors.array()[0].msg);
		// }
		if (req.action === "delete:any") {
			const result = await this.marketingService.delete(
				Number(req.params["id"])
			);

			res.send(result);
		} else {
			throw new ForbiddenError();
		}
	}

	public async sendEmail(req: Request, res: Response, next: NextFunction) {
		console.log(req.body);
		let { sender, receivers, subject, campaignId, campaignName, html, type } =
			req.body.emailData;

		if (!campaignId) {
			const campaign = await this.campaignService.create({name: campaignName})
			
			campaignId = campaign.getDataValue("id")
			// CREATE EMAIL CAMPAIGN
		} 

		for (let email of receivers) {
			console.log(email);
			const result = await this.emailService.sendEmail({
				from: sender,
				to: email,
				subject,
				html,
				type,
			}, campaignId);

			console.log(result);
		}

		res.send({
			message: `Send email for ${receivers.length} users successfully`,
		});
	}
}
export default MarketingController;
