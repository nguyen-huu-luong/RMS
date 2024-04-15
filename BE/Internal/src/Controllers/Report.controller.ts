import { NextFunction, Request, Response } from "express";

import { ChartQueryOptions, QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { ForbiddenError, ValidationError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { ReportService } from "../Services";

@LogRequests
@AddTryCatchBlock
class ReportController {
	protected reportService: ReportService;
	constructor() {
		this.reportService = new ReportService();
	}

	public async getProfit(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			if (!req.query.type) {
				throw new Error("Type parameter is missing.");
			}
			const type: string = req.query.type as string;
			let beginDate: Date | undefined;
			let endDate: Date | undefined;
			if (req.query.beginDate) {
				beginDate = new Date(req.query.beginDate as string);
			}
			if (req.query.endDate) {
				endDate = new Date(req.query.endDate as string);
			}
			const queries: ChartQueryOptions = { type, beginDate, endDate };
			const data = await this.reportService.getProfit(queries);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

    public async getLead(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries: ChartQueryOptions = req.body;
			const data = await this.reportService.getLead(queries);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

    public async getProductChart(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries: ChartQueryOptions = req.body;
			const data = await this.reportService.getProductChart(queries);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}

    public async getCustomerChart(req: Request, res: Response, next: NextFunction) {
		if (req.action === "read:any") {
			const queries: ChartQueryOptions = req.body;
			const data = await this.reportService.getCustomerChart(queries);
			res.send(data);
		} else {
			throw new ForbiddenError();
		}
	}
}

export default ReportController;
