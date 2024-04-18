import { body, param } from "express-validator";
class ClientValidator {
	static createTargetlistValidator = [
		body("name")
			.trim()
			.notEmpty()
			.withMessage("name of Targetlist CANNOT be empty")
			.bail()
			.isEmail()
			.withMessage("Email is invalid"),
	];
}

export { ClientValidator };
