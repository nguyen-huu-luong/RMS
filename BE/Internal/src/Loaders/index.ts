import DBConnect from "./db";
import seqObj from "../Configs/sequenlize";
import { Sequelize } from 'sequelize';

class Loader {
    protected connection: DBConnect;
    public static sequelize = seqObj.getSequelize();

    constructor() {
        this.connection = new DBConnect();
    }
    public async load() {
        try {
            await this.connection.checkDB();
            await this.connection.connect(Loader.sequelize);
            await Loader.sequelize.authenticate();
            console.log("Load resources successfully!");
        }
        catch (err) {
            console.log("Load resources failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Loader;