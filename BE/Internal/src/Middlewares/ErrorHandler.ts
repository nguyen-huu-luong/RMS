import { BaseError } from "../Errors";
import { BaseMiddleware } from "./BaseMiddleware";
import { ErrorUtil } from "../Utils/Error";

class ErrorHandler extends BaseMiddleware {
    

	protected static handle(): any {
		if (!this.error) {
			return this.next();
		}

		if (this.isErrorProperlyFormatted()) {
			return this.sendErrorResponse();
		}

		return this.parseErrorAndSendResponse();
	}

	private static isErrorProperlyFormatted() {
		return this.error instanceof BaseError;
	}

	private static sendErrorResponse() {
		return this.response
			.status(this.error.code)
			.send(this.error.toPlainObject());
	}

	private static parseErrorAndSendResponse() {
		this.error = ErrorUtil.parse(this.error);
		return this.sendErrorResponse();
	}
}

export { ErrorHandler };
