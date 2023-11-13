import jwt from "jsonwebtoken";
import crypto from 'crypto';
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

	static hash(token: string, secret: string) {
        if (!secret) {
            throw new Error("Secket key required")
        }
        const hash = crypto.createHmac('sha256', secret).update(token).digest('hex');
        return hash;
    }
}

export {TokenUtil};
