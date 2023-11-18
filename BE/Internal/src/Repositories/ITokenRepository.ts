import Token from "../Models/Token";
import { IBaseRepository } from "./IBaseRepository";

interface ITokenRepository extends IBaseRepository<Token> {
    clearTokens(userId: number): Promise<any> ;
    removeToken(token: string, userId: number): Promise<any> ;
}

export {ITokenRepository}