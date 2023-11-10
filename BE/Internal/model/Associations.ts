

class Association {
    public static async initialize() {
        try {
            // await Customer.association();
            // await Order.association();
            // await Table.association();
            // await ClientAccount.association();
        }
        catch (err) {
            console.log("Initialize association failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Association;