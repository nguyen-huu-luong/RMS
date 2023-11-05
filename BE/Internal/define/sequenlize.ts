import * as dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

class SeqObject {
    protected sequenlize: any;
    
    constructor() {
        const database: any = process.env.DATABASE;
        const user: any = process.env.USER;
        const pswd: any = process.env.PASSWORD;
        const dialect: any = process.env.DIALECT;
        const host: any = process.env.HOST;
        this.sequenlize = new Sequelize(
            database, user, pswd, {
            host: host,
            dialect: dialect,
            logging: false
        });
    }

    public getSequenlize(): any {
        return this.sequenlize;
    }
}

const seqObj = new SeqObject();

export default seqObj;