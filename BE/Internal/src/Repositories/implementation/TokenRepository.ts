import { injectable } from "inversify";
import Token from "../../Models/Token";
import { ITokenRepository } from "../ITokenRepository";
import { BaseRepository } from "./BaseRepository";
import { where } from "sequelize";


@injectable()
export class TokenRepository
	extends BaseRepository<Token>
	implements ITokenRepository
{
	constructor() {
		super(Token);
	}

    public async clearTokens(userId: number): Promise<any> {
        this._model.destroy({where: {
            tokenableId: userId
        }})
    }

    public async removeToken(token: string, userId: number): Promise<number> {
		return Token.destroy({where: {tokenableId: userId, value: token}})
	}
}
