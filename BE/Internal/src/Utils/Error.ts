import { ErrorName } from "../Constants";
import * as Errors from "../Errors";

class ErrorUtil {
	public static parse(error: any): Errors.BaseError {
		switch (error.name) {
			case ErrorName.BAD_REQUEST:
				return new Errors.BadRequestError(error.message, error.stack);

			case ErrorName.FORBIDDEN:
				return new Errors.ForbiddenError(error.message, error.stack);

			case ErrorName.NOT_FOUND:
				return new Errors.NotFoundError(error.message, error.stack);

			case ErrorName.INTERNAL_SERVER_ERROR:
				return new Errors.InternalServerError(error.message, error.stack);

			case ErrorName.VALIDAION_ERROR:
				return new Errors.ValidationError(error.message, error.stack);

			case ErrorName.UNAUTHORIZED:
				return new Errors.UnauthorizedError(error.message, error.stack);

			default:
				return new Errors.UnknownError(error.message, error.stack);
		}
	}
}

export { ErrorUtil };
