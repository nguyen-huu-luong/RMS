import { NextFunction, Request, Response } from "express";
import { AuthMiddleware } from "../../../src/Middlewares";
import { TokenUtil } from "../../../src/Utils";
import { JsonWebTokenError } from "jsonwebtoken";
import { UnauthorizedError } from "../../../src/Errors";

describe("AuthMiddleware", () => {
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {};
        mockNext = jest.fn();
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it("should set userId, token, and role in request when token is valid", async () => {
        const token = "validToken";
        const decoded = { id: 1, role: "user" };
        TokenUtil.verify = jest.fn().mockResolvedValue(decoded);
        mockRequest.header = jest.fn().mockReturnValue(`Bearer ${token}`);

        await AuthMiddleware.initialize(mockRequest as Request, mockResponse as Response, mockNext);

        expect(mockRequest.userId).toBe(decoded.id);
        expect(mockRequest.token).toBe(token);
        expect(mockRequest.role).toBe(decoded.role);
        expect(mockNext).toHaveBeenCalled();
    });

    it("should throw UnauthorizedError when token is missing", async () => {
        mockRequest.header = jest.fn().mockReturnValue(undefined);

        await AuthMiddleware.initialize(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError("You are unauthenticated!"));
    });

    it("should throw UnauthorizedError when token is invalid", async () => {
        const errorMessage = "Invalid token";
        (TokenUtil.verify as jest.Mock).mockRejectedValue(new Error(errorMessage));
        mockRequest.header = jest.fn().mockReturnValue("Bearer invalidToken");
    
        await AuthMiddleware.initialize(
          mockRequest as Request,
          mockResponse as Response,
          mockNext
        );
    
        expect(mockNext).toHaveBeenCalledWith(new UnauthorizedError(errorMessage));
      });



});
