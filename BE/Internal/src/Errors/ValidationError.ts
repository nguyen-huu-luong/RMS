import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class ValidationError extends BaseError {
	constructor(
		public message = "Validation faild!",
		public stackTrace?: string
	) {
		super(HttpStatusCode.BadRequest, ErrorName.VALIDAION_ERROR, message, stackTrace);
	}
}
