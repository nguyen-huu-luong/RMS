import { CookieOptions, NextFunction, Request, Response } from "express";
import { container, mailler } from "../Configs";
import { IClientRepository } from "../Repositories/IClientRepository";
import { TYPES } from "../Types/type";
import { Client, Employee } from "../Models";
import { Password, TokenUtil } from "../Utils";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import {
	ACCESS_TOKEN,
	ClientType,
	ErrorName,
	HttpStatusCode,
	REFRESH_TOKEN,
	TOKEN_EXPIRE_IN,
} from "../Constants";
import { validationResult } from "express-validator";
/// <reference path="./types/globle.d.ts" />

import {
	BadRequestError,
	CustomError,
	RecordNotFoundError,
	UnauthorizedError,
	ValidationError,
} from "../Errors";
import Token from "../Models/Token";
import { ICartRepository } from "../Repositories";
import { IEmployeeRepository, ITokenRepository } from "../Repositories";

export class AuthService {
	constructor(
		private clientRepository = container.get<IClientRepository>(
			TYPES.IClientRepository
		),
		private EmployeeRepository = container.get<IClientRepository>(
			TYPES.IClientRepository
		),
		private cartRepository = container.get<ICartRepository>(
			TYPES.ICartRepository
		),
		private employeeRepository = container.get<IEmployeeRepository>(
			TYPES.IEmployeeRepository
		),
        private tokenRepository = container.get<ITokenRepository>(
			TYPES.ITokenRepository
		)
	) {} 

	public userLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				throw new ValidationError(errors.array()[0].msg);
			}

			const { email, password } = req.body;
			const user = await this.clientRepository.findByEmail(email);
			if (!user) {
				throw new RecordNotFoundError("User not exist");
			}

			if (!user.isRegistered) {
				throw new RecordNotFoundError("User not exist");
			}

			const isCorrectPassword = await user.checkPassword(password);
			if (!isCorrectPassword) {
				throw new BadRequestError("Password is incorrect");
			}

			this.sendToken(res, user);
			// mailler.sendEmail({
			// 	from: "minhvuonglht10@gmail.com",
			// 	to: "vuong.lieu080519@hcmut.edu.vn",
			// 	subject: "Sending Email using Node.js",
			// 	html: "<p>Bạn đã đăng nhập vào BK food",
			// })

		} catch (err) {
			//
			next(err);
		}
	};
	public usersignUp = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				throw new ValidationError(errors.array()[0].msg);
			}
			const { firstname, lastname, email, password, birthday } = req.body;
			let user = await this.clientRepository.findByEmail(email);
			if (user) {
				if (user.isRegistered) {
					throw new CustomError(
						HttpStatusCode.Conflict,
						ErrorName.CONFLICT,
						"User already exists"
					);
				}
				await user.update({ isRegistered: true });
				this.sendToken(res, user);
			} else {
				const hashedPassword = await Password.hash(password);
				user = await this.clientRepository.create({
					email,
					firstname,
					lastname,
					hashedPassword,
					birthday,
					isRegistered: true,
					type: ClientType.LEAD,
				});
				const cart = await this.cartRepository.create({
					total: 0,
					amount: 0,
					clientId: user.getDataValue('id')
				})
				await user.createChannel()
				
				this.sendToken(res, user);
			}
		} catch (err) {
			console.log(err);
			next(err);
		}
	};

	public adminLogin = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				throw new ValidationError(errors.array()[0].msg);
			}

			const { username, password } = req.body;
			const user = await this.employeeRepository.findByUsername(username);
			if (!user) {
				throw new RecordNotFoundError("User not exist");
			}

			const isCorrectPassword = await user.checkPassword(password);
			if (!isCorrectPassword) {
				throw new BadRequestError("Password is incorrect");
			}

			this.sendToken(res, user);
		} catch (error) {
			next(error);
		}
	};

	public logout = async (req: Request, res: Response, next: NextFunction) => {
		try {
			const userId = req.userId;

			const cookies = req.cookies;
			const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

			const rTknHash = TokenUtil.hash(refreshToken, REFRESH_TOKEN.secret || "");
			const result = await this.tokenRepository.removeToken(rTknHash, userId);
			console.log(result.email);

			const expireCookieOptions = Object.assign(
				{},
				REFRESH_TOKEN.cookie.options,
				{
					expires: new Date(1),
				}
			);
			// Destroy refresh token cookie
			res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);

			res.status(205).send({
				success: true,
				message: "Log out",
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	};

	public logoutAllDevices = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			// Authenticated user ID attached on `req` by authentication middleware
			const userId = req.userId;
			const user = await this.clientRepository.findById(userId);

			await this.tokenRepository.clearTokens(userId);

			// Set cookie expiry to past date to mark for destruction
			const expireCookieOptions = Object.assign(
				{},
				REFRESH_TOKEN.cookie.options,
				{
					expires: new Date(1),
				}
			);

			// Destroy refresh token cookie
			res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
			res.status(205).json({
				success: true,
			});
		} catch (error) {
			console.log(error);
			next(error);
		}
	};

	public refreshToken = async (
		req: Request,
		res: Response,
		next: NextFunction
	) => {
		try {
			const cookies = req.cookies;
			const authHeader = req.header("Authorization");

			if (!cookies[REFRESH_TOKEN.cookie.name]) {
				throw new UnauthorizedError(
					"Authentication error! Refresh Token is missing!"
				);
			}
			if (!authHeader?.startsWith("Bearer ")) {
				throw new UnauthorizedError(
					"Authentication Error! Invalid Access Token."
				);
			}

			const accessTokenParts = authHeader.split(" ");
			const staleAccessTkn = accessTokenParts[1];

			if (!ACCESS_TOKEN.secret) {
				throw new Error("Can not found access token secket key");
			}
			const decodedExpiredAccessTkn = jwt.verify(
				staleAccessTkn,
				ACCESS_TOKEN.secret,
				{
					ignoreExpiration: true,
				}
			);

			const rfTkn = cookies[REFRESH_TOKEN.cookie.name];
			// @ts-ignore
			const decodedRefreshTkn = await jwt.verify(rfTkn, REFRESH_TOKEN.secret);
			console.log(decodedRefreshTkn);

			const userWithRefreshTkn = await this.clientRepository.findById(
				// @ts-ignore
				decodedExpiredAccessTkn.id
			);
			if (!userWithRefreshTkn) {
				throw new UnauthorizedError(
					"Authentication Error. You are unauthenticated!"
				);
			}
			// // GENERATE NEW ACCESSTOKEN
			const accessToken = userWithRefreshTkn.generateAccessToken();

			// Send back new created accessToken
			res.status(201);
			res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });
			res.json({
				success: true,
				accessToken,
			});
		} catch (error: any) {
			console.log(error);
			if (error instanceof TokenExpiredError || JsonWebTokenError) {
				next(new UnauthorizedError(error.message, error.stack));
			}
			next(error);
		}
	};

	private async sendToken(res: Response, user: Client | Employee, message?: string) {
		const accessToken = user.generateAccessToken();
		const refreshToken = await user.generateRefreshToken();

		if (REFRESH_TOKEN.cookie && REFRESH_TOKEN.cookie.options) {
			res.cookie(
				REFRESH_TOKEN.cookie.name,
				refreshToken,
				REFRESH_TOKEN.cookie.options as CookieOptions
			);
		}

		res.send({
			success: true,
			message,
			accessToken,
			user,
		});
	}
}
