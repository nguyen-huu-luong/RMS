import { NextFunction, Request, Response } from "express";

import { QueryOptions, TYPES } from "../Types/type";
import { parseRequesQueries } from "../Helper/helper";
import { BadRequestError, ForbiddenError, ValidationError } from "../Errors";
import { AddTryCatchBlock, LogRequests } from "../Utils/decorators";
import { EmployeeService } from "../Services";
import { TrackingService } from "../Services/Tracking.service";

@LogRequests
@AddTryCatchBlock
class TrackingController {
    protected trackingService: TrackingService;
    constructor() {
        this.trackingService = new TrackingService();
    }

    public async trackEmail(req: Request, res: Response, next: NextFunction) {
        const { receipentEmail, campaignId } = req.query;
        if (!receipentEmail || !campaignId) {
            throw new BadRequestError(
                "Invalid tracking email request, missing necessary parameters"
            );
        }

        const result = await this.trackingService.trackEmail(
            receipentEmail as string,
            Number(campaignId)
        );

        return "You sent this email";
    }

    public async trackUrl(req: Request, res: Response, next: NextFunction) {
        let { receipentEmail, campaignId, redirectUrl } = req.query;
        
        if (!receipentEmail || !campaignId || !redirectUrl) {
            throw new BadRequestError(
                "Invalid tracking url request, missing necessary parameters"
                );
            }

        const result = await this.trackingService.trackUrl(
            receipentEmail as string,
            Number(campaignId),
            redirectUrl as string
        );

        if (result) {
            res.redirect(redirectUrl as string )
        }
    }
}

export default TrackingController;
