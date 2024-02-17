import { NextFunction, Request, Response } from "express";
import { ValidationError } from "../../Errors";

const { body, param } = require("express-validator");
class ClientValidator {
	static createOrUpdateValidator = [
        body("data").notEmpty().withMessage("Requried user data!"),
		body("data.firstname").notEmpty().withMessage("Firstname CANNOT be empty"),
        body("data.lastname").notEmpty().withMessage("Lastname CANNOT be empty"),
        (req: Request, res: Response, next: NextFunction) => {
            if (!(body("phone") || body("email"))) {
                next(new ValidationError("Required phone or email to create user"))
            } else {
                next()
            }
        }
	];

    
}

export { ClientValidator };
