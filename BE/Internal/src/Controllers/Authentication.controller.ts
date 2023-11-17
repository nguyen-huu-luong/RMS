import { NextFunction, Request, Response } from "express";
import { AuthService } from "../Services";

class AuthController {
	protected authService: AuthService;

	constructor() {
		this.authService = new AuthService();
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
