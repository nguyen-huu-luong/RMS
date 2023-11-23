import jwt from "jsonwebtoken";
import crypto from "crypto";
import { ACCESS_TOKEN } from "../Constants";
class TokenUtil {
	static async verify(token: string): Promise<any> {
		const secket_key = ACCESS_TOKEN.secret;
		if (!secket_key) {
			throw Error("Can't found serket key!");
		}
		return jwt.verify(token, secket_key);
	}

	static hash(token: string, secret: string) {
		if (!secret) {
			throw new Error("Secket key required");
		}
		const hash = crypto
			.createHmac("sha256", secret)
			.update(token)
			.digest("hex");
		return hash;
	}
}

export { TokenUtil };
