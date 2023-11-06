import * as dotenv from 'dotenv';
import { Dialect, Sequelize } from 'sequelize';

dotenv.config();

class SeqObject {
    protected sequenlize: Sequelize;
    
    constructor() {
        const database: string = process.env.DATABASE as string;
        const user: string = process.env.USER as string;
        const pswd: string = process.env.PASSWORD as string;
        const dialect: Dialect = process.env.DIALECT as Dialect;
        const host: string = process.env.HOST as string;
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