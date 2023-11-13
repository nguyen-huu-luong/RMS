import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class UnknownError extends BaseError {
	constructor(
		public message = "Something went wrong!",
		public stackTrace?: string
	) {
		super(
			HttpStatusCode.InternalServerError,
			'Unknown Error',
			message,
			stackTrace
		);
	}
}
