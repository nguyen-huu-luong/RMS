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
		this.authService.usersignUp(req, res, next);
	};

	public adminLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {};

	public logout = async (req: Request, res: Response, next: NextFunction) => {};

	public refreshToken = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {};
}

export default AuthController;
