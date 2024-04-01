import * as dotenv from "dotenv";
// import * as dbconfig from '../config/database';
import * as nodemailer from "nodemailer";
import { MailOptions } from "nodemailer/lib/json-transport";

dotenv.config();

class NodeMailerConfig {
    private transporter: nodemailer.Transporter;
	static instance: NodeMailerConfig ;
    
    constructor() {
        if (NodeMailerConfig.instance) {
            throw new Error("Using InversifyContainer.getInstance() instead")
        }
        console.log(process.env.GMAIL_USER,process.env.GMAIL_PASSWORD)
        this.transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASSWORD,
          },
        });
      }
    
      public async sendEmail(mailOptions: MailOptions) {
        return await this.transporter.sendMail(mailOptions);
      }

	public getTransporter() {
		return this.transporter;
	}

	static getInstance() {
		NodeMailerConfig.instance = NodeMailerConfig.instance || new NodeMailerConfig() ;
		return NodeMailerConfig.instance ;
	}
}


export default new NodeMailerConfig();
