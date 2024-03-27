import { injectable } from "inversify";
import "reflect-metadata";
import { IClientRepository } from "../IClientRepository";
import { BaseRepository } from "./BaseRepository";
import { Client } from "../../Models";
import Token from "../../Models/Token";
import { REFRESH_TOKEN } from "../../Constants";

@injectable()
export class ClientRepository
	extends BaseRepository<Client>
	implements IClientRepository
{
	constructor() {
		super(Client, ["id", "firstname", "lastname", "phone", "email", "gender", "birthday", "score", "createdAt", "updatedAt"]);
	}

	public async findByEmail(email: string): Promise<Client | null> {
		console.log("fadsfdsa")
		return await this._model.findOne({ where: { email: email } });
	}

	public async removeToken(token: string, user: Client): Promise<Client> {
		let tokens = await user.getTokens();
		tokens = tokens.filter((tokenObj: Token) => tokenObj.value !== token);

		return await user.save();
	}

	
}
