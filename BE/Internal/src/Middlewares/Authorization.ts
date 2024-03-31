import { NextFunction, Request, Response } from "express";
import { BaseMiddleware } from "./BaseMiddleware";
import { AuthorizationService } from "../Services";
import { container } from "../Configs";
import { TYPES } from "../Types/type";
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

		let resource = this.request.originalUrl.split("/")[2];
		resource = resource.split("?")[0];
		console.log(resource);
		const allPermissions = await permissionRepository.findAllByRole(
			this.request.role
		);
		const resquestAction = this.getAction();
		let actions = allPermissions
			.filter((p: Permission) => p.getDataValue("resource") === resource)
			.map((p: Permission) => p.getDataValue("action"))
			.filter(
				(item: string) => item.startsWith(resquestAction) || item === "any"
			);

		if (actions.length === 0) {
			this.next(new ForbiddenError());
		}

		this.request.action = actions[0];
		console.log(
			"Authorization successfully!",
			"role:",
			this.request.role,
			", actions:",
			actions
		);
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
