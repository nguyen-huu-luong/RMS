import {
	Application,
	NextFunction,
	Request,
	Response,
	Router,
} from "express";
import AuthRouter from "./Auth.router";
import ProductRouter from "./Product.router";
import CartRouter from "./Cart.router";
import CategoryRouter from "./Category.router";
import VoucherRouter from "./Voucher.router";
import { HttpStatusCode } from "../Constants";
import { NotFoundError } from "../Errors";
import OrderRouter from "./Order.router";
import ClientRouter from "./Client.router";

process.on("unhandledRejection", (reason, promise) => {
	console.error("Unhandled Rejection at:", promise, "reason:", reason);
  });
class Routers {
	public initialize(app: Application) {
		const orderRouter = new OrderRouter();
		const productRouter = new ProductRouter();	
		const cartRouter = new CartRouter();
		const categoryRouter = new CategoryRouter();
		const voucherRouter = new VoucherRouter();
		const clientRouter = new ClientRouter();
		const authRouter = new AuthRouter();
		// declare your router here
		const router = Router();
        
        
		orderRouter.initialize(router);
		productRouter.initialize(router);
		cartRouter.initialize(router);
		categoryRouter.initialize(router);
		voucherRouter.initialize(router)
		clientRouter.initialize(router)
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
