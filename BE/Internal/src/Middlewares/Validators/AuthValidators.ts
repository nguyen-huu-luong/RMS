const { body, param } = require("express-validator");
class AuthValidators {
	static loginValidator = [
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email CANNOT be empty")
			.bail()
			.isEmail()
			.withMessage("Email is invalid"),
		body("password").notEmpty().withMessage("Password CANNOT be empty"),
	];

	static signUpValidator = [
		body("email")
			.trim()
			.notEmpty()
			.withMessage("Email CANNOT be empty")
			.bail()
			.isEmail()
			.withMessage("Email is invalid"),
		body("password").notEmpty().withMessage("Password CANNOT be empty"),
        body("firstname").notEmpty().withMessage("Firstname CANNOT be empty"),
        body("lastname").notEmpty().withMessage("Lastname CANNOT be empty")
	];
}

export { AuthValidators };
