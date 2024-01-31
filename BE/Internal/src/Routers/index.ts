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
import ProductRouter from "./Product.router";
import CartRouter from "./Cart.router";
import CategoryRouter from "./Category.router";
import VoucherRouter from "./Voucher.router";
import { HttpStatusCode } from "../Constants";
import { NotFoundError } from "../Errors";
import ChannelRouter from "./Channel.router";

class Routers {
	public initialize(app: Application) {
		const router = Router();
		const orderRouter = new OrderRouter();
		const customerRouter = new CustomerRouter();
		const authRouter = new AuthRouter();
		const productRouter = new ProductRouter();
		const cartRouter = new CartRouter();
		const categoryRouter = new CategoryRouter();
		const voucherRouter = new VoucherRouter();
		const channelRouter = new ChannelRouter();
		// declare your router here
        
        
		orderRouter.initialize(router);
		customerRouter.initialize(router);
		productRouter.initialize(router);
		cartRouter.initialize(router);
		categoryRouter.initialize(router);
		voucherRouter.initialize(router)
		channelRouter.initialize(router);
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
