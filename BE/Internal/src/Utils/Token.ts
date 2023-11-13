import jwt from "jsonwebtoken";
class TokenUtil {
	static async verify(token: string): Promise<any> {
		const secket_key = process.env.SECRET_KEY;
		if (!secket_key) {
			throw Error("Can't found serket key!");
		}
		jwt.verify(
			token,
			secket_key,
			(err: jwt.VerifyErrors | null, decoded: any) => {
				if (err) {
					throw err;
				} else {
					return decoded;
				}
			}
		);
	}

	static sign(data: any, expiresIn: string | number) {
		const secket_key = process.env.SECRET_KEY;
		if (!secket_key) {
			throw Error("Can't found serket key!");
		}
		const token = jwt.sign({ data }, secket_key, {
			expiresIn,
		});
		return token;
	}
}

export default TokenUtil;
