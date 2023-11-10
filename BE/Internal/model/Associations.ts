import Customer from "./Client";
import Order from "./order";
import Table from "./table";
import ClientAccount from "./clientAccount";

class Association {
    public static async initialize() {
        try {
            await Customer.association();
            await Order.association();
            await Table.association();
            await ClientAccount.association();
        }
        catch (err) {
            console.log("Initialize association failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Association;