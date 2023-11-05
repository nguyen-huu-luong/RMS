class StatusCode {
    protected statusCode: any;

    constructor() {
        enum status {
            Success = 200,
            Accepted = 202,
            NonAuthoritativeInformation = 203,
            NoContent = 204,
            ResetContent = 205,
            MultipleChoices = 300,
            MovedPermanently = 301,
            Found = 302,
            SeeOther = 303,
            NotModified = 304,
            BadRequest = 400,
            Unauthorized = 401,
            PaymentRequired = 402,
            Forbidden = 403,
            MethodNotAllowed = 405,
            NotFound = 404,
            InternalServerError = 500,
            NotImplemented = 501,
            BadGateway = 502,
            ServiceUnavailable = 503,
            GatewayTimeout = 504
        };

        this.statusCode = status;
    }

    public getStatus(): any {
        return this.statusCode;
    }
}

const statusObj = new StatusCode();

export default statusObj.getStatus();