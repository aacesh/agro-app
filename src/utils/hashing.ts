
import { genSalt, hash, compare } from 'bcrypt';


const hashPassword = async (password: string): Promise<string> => {
    const salt = await genSalt();
    const hashedPassword = await hash(password, salt);
    return hashedPassword
}

const passwordMatched = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await compare(password, hashedPassword);
    return isMatch
}

export {hashPassword, passwordMatched}

