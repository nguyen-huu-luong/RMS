import DBConnect from "./db";
import seqObj from "../define/sequenlize";
import { Sequelize } from 'sequelize';

class Loader {
    protected connection: DBConnect;
    public static sequenlize: any = seqObj.getSequenlize();

    constructor() {
        this.connection = new DBConnect();
    }
    public async load() {
        try {
            await this.connection.checkDB();
            await this.connection.connect(Loader.sequenlize);
            await Loader.sequenlize.authenticate();
            console.log("Load resources successfully!");
        }
        catch (err) {
            console.log("Load resources failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Loader;