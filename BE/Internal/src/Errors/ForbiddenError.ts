import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class ForbiddenError extends BaseError {
	constructor(
		public message = "Can not access this API",
		public stackTrace?: string
	) {
		super(HttpStatusCode.Forbidden, ErrorName.FORBIDDEN, message, stackTrace);
	}
}
