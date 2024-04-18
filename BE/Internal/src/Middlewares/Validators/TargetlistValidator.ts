import { body, param } from "express-validator";
class TargetListValidator {
    static createTargetlistValidator = [
        body("name")
        .trim()
        .notEmpty()
        .withMessage("name of Targetlist CANNOT be empty"),
    ];
}

export { TargetListValidator };
