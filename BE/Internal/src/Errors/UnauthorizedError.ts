import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class UnauthorizedError extends BaseError {
	constructor(
		public message = "No authorization token was found!",
		public stackTrace?: string
	) {
		super(
			HttpStatusCode.Unauthorized,
			ErrorName.UNAUTHORIZED,
			message,
			stackTrace
		);
	}
}
