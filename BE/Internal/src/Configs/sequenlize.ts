import * as dotenv from 'dotenv';
import { Dialect, Sequelize } from 'sequelize';
// import * as dbconfig from '../config/database';

dotenv.config();

class SeqObject {
    protected sequelize;
    
    constructor() {
        const database = process.env.DB_DATABASE as string;
        const user = process.env.DB_USERNAME as string;
        const pswd = process.env.DB_PASSWORD as string;
        const dialect = process.env.DB_DIALECT as Dialect;
        const host = process.env.DB_HOST ;
        this.sequelize = new Sequelize(
            database, user, pswd, {
                host: host,
                dialect: dialect,
                logging: false,
                define: {
                    underscored: false
                }
            });
        }
        
        public getSequelize(): Sequelize {
            // console.log(dbconfig);
            return this.sequelize;
        }
    }
    
const seqObj: SeqObject = new SeqObject();

export default seqObj;