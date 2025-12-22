import bcrypt from 'bcryptjs';
import { Hasher } from 'domain/_utils/auth/types';

export class HasherImpl implements Hasher {
    public hashPassword(password: string): string {
        return bcrypt.hashSync(password, 10);
    }

    public comparePasswords(input: string, hashed: string): boolean {
        return bcrypt.compareSync(input, hashed);
    }
}
