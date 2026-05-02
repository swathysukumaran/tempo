import crypto from 'crypto';
import bcrypt from 'bcrypt';

const BCRYPT_ROUNDS = 10;

export const random = () => crypto.randomBytes(128).toString('base64');

export const hashPassword = (password: string): Promise<string> =>
    bcrypt.hash(password, BCRYPT_ROUNDS);

export const comparePassword = (password: string, hash: string): Promise<boolean> =>
    bcrypt.compare(password, hash);