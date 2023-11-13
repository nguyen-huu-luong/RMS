import bcrypt from 'bcrypt';
const SaltOrRound = 10;
class PasswordUtil {
    static async hash(password: string) {
        return await bcrypt.hash(password, SaltOrRound)
    }
}

export default PasswordUtil;