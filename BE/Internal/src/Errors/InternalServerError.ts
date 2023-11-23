
import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class InternalServerError extends BaseError {
	constructor(
		public message = "Something went wrong",
		public stackTrace?: string
	) {
		super(HttpStatusCode.InternalServerError, ErrorName.INTERNAL_SERVER_ERROR, message, stackTrace);
	}
}
