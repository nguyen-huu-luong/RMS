import { NextFunction, Request, Response } from "express";
import { TokenUtil } from "../Utils";
import { BaseMiddleware } from "./BaseMiddleware";
import { BadRequestError, CustomError, UnauthorizedError } from "../Errors";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { HttpStatusCode } from "../Constants";

class AuthMiddleware extends BaseMiddleware {
	protected static handle(): any {
		this.verifyToken();
	}

	public static initialize = (
		request: Request,
		response: Response,
		next: NextFunction
	) => {
		this.setProperties(request, response, next);
		return this.handle();
	};

	private static async verifyToken(): Promise<any> {
		try {
			const authHeader = this.request.header("Authorization");
			if (!authHeader?.startsWith("Bearer ")) {
				throw new UnauthorizedError("You are unauthenticated!");
			}
			let token = authHeader.split(" ")[1];
			const decoded = await TokenUtil.verify(token);
			this.request.userId = decoded.id;
			this.request.token = token;
			this.request.role = decoded.role;
			console.log(
				"Authentication successfully! ",
				"id:",
				decoded.id,
				", role:",
				decoded.role
			);
			this.next();
		} catch (error: any) {
			if (error instanceof TokenExpiredError || JsonWebTokenError) {
				this.next(new UnauthorizedError(error.message, error.stack));
			}
			this.next(error);
		}
	}
}

export { AuthMiddleware };
