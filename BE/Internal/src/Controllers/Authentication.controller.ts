import { NextFunction, Request, Response } from "express";
import { AuthService } from "../Services";
import { EmailService } from '../Services/Email.service';

class AuthController {
	protected authService: AuthService;
	protected emailService: EmailService

	constructor() {
		this.authService = new AuthService();
		this.emailService = new EmailService()
	}

	public userLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		this.authService.userLogin(req, res, next);
	};

	public usersignUp = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		await this.authService.usersignUp(req, res, next);
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

	};

	public adminLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
        await this.authService.adminLogin(req,res,next)
    };

	public logout = async (req: Request, res: Response, next: NextFunction) => {
		await this.authService.logout(req, res, next);
	};

    public logoutAllDevices = async (req: Request, res: Response, next: NextFunction) => {
		await this.authService.logoutAllDevices(req, res, next);
	};

	public refreshToken = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
        await this.authService.refreshToken(req, res, next)
    };
}

export default AuthController;
