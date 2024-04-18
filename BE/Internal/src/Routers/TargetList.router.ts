import { AuthMiddleware } from "../Middlewares";
import { Authorization } from "../Middlewares/Authorization";
import TargetListController from "../Controllers/TargetList.controller";
import { Router } from "express";
import { TargetListValidator } from "../Middlewares/Validators/TargetlistValidator";

class TargetListRouter {
  constructor() {}

  public initialize(router: Router) {
    const targetListController = new TargetListController();
    const targetlistRouter = Router();
    targetlistRouter.get("/all", targetListController.getAll.bind(targetListController));
    targetlistRouter.get("/:id", targetListController.getById.bind(targetListController));
    targetlistRouter.post(
      "",
      TargetListValidator.createTargetlistValidator,
      targetListController.create.bind(targetListController)
    );
    targetlistRouter.put("/:id", targetListController.update.bind(targetListController));
    targetlistRouter.delete("/:id", targetListController.delete.bind(targetListController));

    router.use("/targetlists", 
      AuthMiddleware.initialize, 
      Authorization.initialize, 
      targetlistRouter.bind(targetListController)
    );
  }
}

export default TargetListRouter;
