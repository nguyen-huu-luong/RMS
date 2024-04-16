import { body, param } from "express-validator";

class CampaignValidator {
	static createCampaignValidator = [
		body("name")
			.trim()
			.notEmpty()
			.withMessage("name of Campaign CANNOT be empty"),
        body("type")
			.trim()
			.notEmpty()
			.withMessage("type of Campaign CANNOT be empty"),
        body("status")
			.trim()
			.notEmpty()
			.withMessage("status of Campaign CANNOT be empty"),
        body("startDate")
			.trim()
			.notEmpty()
			.withMessage("startDate of Campaign CANNOT be empty")
            .isDate()
            .withMessage("Invalid startDate"),
        body("endDate")
			.trim()
			.notEmpty()
			.withMessage("endDate of Campaign CANNOT be empty")
            .isDate()
            .withMessage("Invalid endDate")
        
        
	];
}

export { CampaignValidator };
