import { EmployeeController } from "../Controllers";
import { NextFunction, Request, Response, Router } from "express";
import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";

// @injectable()
class EmployeeRouter {
    protected EmployeeController: EmployeeController;
    constructor() {
        this.EmployeeController = new EmployeeController();
    }

    public initialize(router: Router) {
        const employeeRouter = Router();
        employeeRouter.get("/all",this.EmployeeController.getAllEmployee.bind(this.EmployeeController));
        employeeRouter.get("/:id", this.EmployeeController.getEmployeeInfo.bind(this.EmployeeController));
        employeeRouter.post("", this.EmployeeController.createEmployee.bind(this.EmployeeController));
        employeeRouter.put("/:id", this.EmployeeController.updateEmployee.bind(this.EmployeeController));
        employeeRouter.delete("/:id", this.EmployeeController.delete.bind(this.EmployeeController));

        router.use("/employees", AuthMiddleware.initialize, Authorization.initialize, employeeRouter);
    }
}

export default EmployeeRouter;
