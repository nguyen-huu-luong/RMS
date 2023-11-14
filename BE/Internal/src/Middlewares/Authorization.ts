import { NextFunction, Request, Response } from "express";
import { BaseMiddleware } from "./BaseMiddleware";
import { AuthorizationService } from "../Services";
import { container } from "../Configs";
import { TYPES } from "../Repositories/type";
import { IPermissionRepository } from "../Repositories/IPermissionRepository";
import { Permission } from "../Models";
import { ForbiddenError } from "../Errors";

class Authorization extends BaseMiddleware {
	protected static handle(): any {
		this.checkPermission();
	}

	public static initialize = (
		request: Request,
		response: Response,
		next: NextFunction
	) => {
		this.setProperties(request, response, next);
		return this.handle();
	};

	private static async checkPermission() {
		const permissionRepository = container.get<IPermissionRepository>(
			TYPES.IPermissionRepository
		);

		const resource = this.request.originalUrl.split("/")[2];
		const allPermissions = await permissionRepository.findAllByRole("client");
		const resquestAction = this.getAction();
		let actions = allPermissions
			.filter((p: Permission) => p.getDataValue("resource") === resource)
			.map((p: Permission) => p.getDataValue("action"))
			.filter((item: string) => item.startsWith(resquestAction));

		if (actions.length === 0) {
			this.next(new ForbiddenError());
		}

		this.request.action = actions[0];
		this.next();
	}

	private static getAction(): string {
		const method = this.request.method;

		return (
			(method === "GET" && "read") ||
			(method === "POST" && "create") ||
			(method === "PUT" && "update") ||
			(method === "PATCH" && "update") ||
			(method === "DELETE" && "delete") ||
			"unknown"
		);
	}
}

export { Authorization };