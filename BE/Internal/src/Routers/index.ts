import express, {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from "express";
import OrderRouter from "./Order.router";
import CustomerRouter from "./Client.router";
import AuthRouter from "./Auth.router";
import { HttpStatusCode } from "../Constants";
import { NotFoundError } from "../Errors";

class Routers {
	public initialize(app: Application) {
		const router = Router();
		const orderRouter = new OrderRouter();
		const customerRouter = new CustomerRouter();
		const authRouter = new AuthRouter();
		// declare your router here
        
        
		orderRouter.initialize(router);
		customerRouter.initialize(router);
		app.use("/api/users", authRouter.initialize());
		app.use("/api", router);

		app._router.all(
			"*",
			(request: Request, response: Response, next: NextFunction) => {
				let err = new NotFoundError("Không có api");
				response.status(HttpStatusCode.NotFound).send(err.toPlainObject());
			}
		);
	}
}

const router = new Routers();

export default router;
