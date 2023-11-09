import * as dotenv from 'dotenv';
import { Dialect, Sequelize } from 'sequelize';

dotenv.config();

class SeqObject {
    protected sequenlize: Sequelize;
    
    constructor() {
        const database = process.env.DB_DATABASE as string;
        const user = process.env.DB_USERNAME as string;
        const pswd = process.env.DB_PASSWORD as string;
        const dialect = process.env.DB_DIALECT as Dialect;
        const host = process.env.DB_HOST ;
        this.sequenlize = new Sequelize(
            database, user, pswd, {
            host: host,
            dialect: dialect,
            logging: false
        });
    }

    public getSequenlize(): Sequelize {
        return this.sequenlize;
    }
}

const seqObj: SeqObject = new SeqObject();

export default seqObj;