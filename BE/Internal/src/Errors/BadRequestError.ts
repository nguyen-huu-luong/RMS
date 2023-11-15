import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class BadRequestError extends BaseError {
	constructor(public message = "Invalid request!", public stackTrace?: string) {
		super(
			HttpStatusCode.BadRequest,
			ErrorName.BAD_REQUEST,
			message,
			stackTrace
		);
	}
}
