import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class NotFoundError extends BaseError {
	constructor(
		public message = "API not found",
		public stackTrace?: string
	) {
		super(HttpStatusCode.NotFound, ErrorName.NOT_FOUND, message, stackTrace);
	}
}
