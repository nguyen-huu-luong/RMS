import { Connection, Pool } from 'pg';
import { Sequelize } from 'sequelize';

class DBConnect {
    public async checkDB() {
        try {
            const connection: Pool = new Pool({
                host: process.env.DB_HOST,
                user: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
            });
            const query: string = `SELECT FROM pg_database WHERE datname = '${process.env.DB_DATABASE}'`;
            const dbQuery = await connection.query(query);

            if (dbQuery.rows.length === 0) {
                // Database does not exist, make it:
                await connection.query(`CREATE DATABASE "${process.env.DB_DATABASE}"`);
            }
            await connection.end();
        }
        catch (err) {
            console.log("Check the existence of database failed!");
            console.log(`Error: ${err}`);
        }
    }

    public async connect(sequenlize: Sequelize) {
        try {
            await sequenlize.authenticate();
            console.log("Connect to database successfully!");
        }
        catch (err) {
            console.log("Connect to database failed!");
            console.log(`Error: ${err}`);
        }
    }
}

export default DBConnect;