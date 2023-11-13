import { NextFunction, Request, Response } from "express";
import { TokenUtil } from "../Utils";
import { BaseMiddleware } from "./BaseMiddleware";

class AuthMiddleware extends BaseMiddleware {
	protected static handle(): any {
		this.verifyToken();
	}

	private static async verifyToken(): Promise<any> {
		let token = this.request.headers.authorization || "";
		if (token.startsWith("Bearer ")) {
			token = token.split(" ")[1];
		}
		try {
			const decoded = await TokenUtil.verify(token);
			console.log(decoded);
		} catch (error: any) {
			this.next(error);
		}
	}
}

export { AuthMiddleware };
