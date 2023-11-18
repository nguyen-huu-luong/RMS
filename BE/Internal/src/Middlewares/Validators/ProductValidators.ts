const { body, param } = require("express-validator");
class ProductValidators {
	static createProductValidator = [
        body("name")
            .trim()
            .notEmpty()
            .withMessage("Name cannot be empty"),
        
        body("description")
            .trim()
            .notEmpty()
            .withMessage("Description cannot be empty"),

        body("price")
            .isFloat({ min: 0 })
            .withMessage("Price must be a non-negative number")
	];
}

export { ProductValidators };
