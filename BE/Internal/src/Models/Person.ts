import {
	Model,
	type HasManyGetAssociationsMixin,
	type HasManyRemoveAssociationsMixin,
    HasManyCreateAssociationMixin,
} from "sequelize";
import bcrypt from "bcrypt";


import Token from "./Token";
import { ACCESS_TOKEN, REFRESH_TOKEN, Role } from "../Constants";
import jwt from "jsonwebtoken";
import { TokenUtil } from "../Utils";

abstract class Person extends Model {
    declare createToken: HasManyCreateAssociationMixin<Token>
    declare getTokens: HasManyGetAssociationsMixin<Token> 
    declare removeTokens: HasManyRemoveAssociationsMixin<Token, number>

	declare id: number;
	declare firstname: string;
	declare lastname: string;
	declare email: string;
	declare isRegistered: boolean;
	declare hashedPassword: string;
    declare role: string;

	public async checkPassword(password: string) {
        console.log("Comparing password.....", password, this.hashedPassword)
		const result = await bcrypt.compare(password, this.hashedPassword);
        console.log(result ? "Password Ok!": "Incorrect password")
		return result;
	}

	public generateAccessToken() {
		const user = this;

		if (!ACCESS_TOKEN.secret) {
			throw Error("Can't found serket key!");
		}
		const accessToken = jwt.sign(
			{
				id: user.id.toString(),
				fullName: `${user.firstname} ${user.lastname}`,
				email: user.email,
                role: user.role || Role.USER
			},
			ACCESS_TOKEN.secret,
			{
				expiresIn: ACCESS_TOKEN.expiry,
			}
		);

		return accessToken;
	}

	public async generateRefreshToken() {
		const user = this;

		// Create signed refresh token
		if (!REFRESH_TOKEN.secret) {
			throw Error("Can't found serket key!");
		}
		const refreshToken = jwt.sign(
			{
				id: user.id.toString(),
			},
			REFRESH_TOKEN.secret,
			{
				expiresIn: REFRESH_TOKEN.expiry,
			}
		);

		// Create a 'refresh token hash' from 'refresh token'
		const rTknHash = TokenUtil.hash(refreshToken, REFRESH_TOKEN.secret)
            
		// Save 'refresh token hash' to database
		await user.createToken({value: rTknHash});
		await user.save();


		return refreshToken;
	}
}


export default Person;
