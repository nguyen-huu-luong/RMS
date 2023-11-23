import { ErrorName, HttpStatusCode } from "../Constants";
import { BaseError } from "./BaseError";

export class CustomError extends BaseError {
	constructor(
		public code: HttpStatusCode,
		public name: ErrorName,
		public message: string,
		public stackTrace?: string
	) {
		super(code, name, message, stackTrace);
	}
}
