import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from 'express';
import { SubscriberService } from '../Services/Subscriber.service';
import { EmailService } from '../Services/Email.service';

dotenv.config();

class SubscriberController {
    protected subscriberService: SubscriberService;
    protected emailService: EmailService

    constructor() {
        this.subscriberService = new SubscriberService();
        this.emailService = new EmailService()
    }

    public async createSubsciber(req: Request, res: Response, next: NextFunction) {
        const result = await this.subscriberService.createSubscriber(req, res, next)
        if (result.status == "Success") {
            this.emailService.sendEmail({
                from: `${process.env.GMAIL_USER}`,
                to: req.body.email,
                subject: "Welcome to become a part of HOME CUISINE",
                html: ` <p>Hello <i>${req.body.name}</i>,</p>
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
        }
        res.send(result)
    }
}

export default SubscriberController;