import Association from "./Associations";
import Loader from "../loader";

class Tables {
    public async createTables() {
        try {
            await Association.initialize();
            // await Loader.sequelize.sync({ alter: true, });

        }
        catch (err) {
            console.log("Create all tables failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Tables;