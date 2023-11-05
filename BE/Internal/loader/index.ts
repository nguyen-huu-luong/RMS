import DBConnect from "./db";

class Loader {
    protected connection: any;

    constructor() {
        this.connection = new DBConnect();
    }
    public async load(sequenlize: any) {
        try {
            await this.connection.checkDB();
            await this.connection.connect(sequenlize);
            await sequenlize.authenticate();
            console.log("Load resources successfully!");
        }
        catch (err) {
            console.log("Load resources failed!");
            console.log(`Err: ${err}`);
        }
    }
}

export default Loader;