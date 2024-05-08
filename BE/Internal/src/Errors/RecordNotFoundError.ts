import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class RecordNotFoundError extends BaseError {
	constructor(
		public message = "Record not found",
		public fieldEror?: string,
		public stackTrace?: string
	) {
		super(HttpStatusCode.NotFound, ErrorName.RECORD_NOT_FOUND, message,fieldEror,  stackTrace);
	}
}
