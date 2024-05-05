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
      const { email, campaign } = req.query;
      console.log(
        `User with email ${email} sent this email in campaign #${campaign}`
      );

    // if (!email || !campaign) {
    //   throw new BadRequestError(
    //     "Invalid tracking email request, missing necessary parameters"
    //   );
    // }

    // const result = await this.trackingService.trackEmail(
    //   email as string,
    //   Number(campaign)
    // );

    // res.send("https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTTUzn7-qinvq-jbUgQWNL-OfnXUFXfxbtwMs6-Utey3A&s")
    res.sendFile(__dirname + "/download.png")
  }

  public async trackUrl(req: Request, res: Response, next: NextFunction) {
    let { email, campaignId, redirectUrl } = req.query;

    console.log(`customer with ưmail ${email} clicked to url ${redirectUrl}`)
    if (!email || !campaignId || !redirectUrl) {
      throw new BadRequestError(
        "Invalid tracking url request, missing necessary parameters"
      );
    }

    const result = await this.trackingService.trackUrl(
      email as string,
      Number(campaignId),
      redirectUrl as string
    );

    if (result) {
      res.redirect(redirectUrl as string);
    }
  }
}

export default TrackingController;
