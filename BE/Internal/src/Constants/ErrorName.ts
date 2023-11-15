export enum ErrorName  {
    BAD_REQUEST = "BadRequestError", // 400
    VALIDAION_ERROR = "ValidationError", // 400

    UNAUTHORIZED = "Unauthorized", // 401
    FORBIDDEN = "ForbiddenError",  // 403
    NOT_FOUND = "NotFoundError", // 404
    RECORD_NOT_FOUND = "RecordNotFoundError", // 404
    CONFLICT = "Conflict", // 409
    INTERNAL_SERVER_ERROR = "InternalServerError", // 500
}
