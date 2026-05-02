import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, hashPassword, comparePassword } from '../helpers';

export const register: express.RequestHandler = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password, username } = req.body;

        if (!email || !password || !username) {
            res.status(400).json({ error: 'Missing required fields' });
            return;
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const user = await createUser({
            email,
            username,
            authentication: {
                password: await hashPassword(password),
            }
        });

        user.authentication.sessionToken = random();
        await user.save();

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('TEMPO-AUTH', user.authentication.sessionToken, {
            path: '/',
            sameSite: isProd ? 'none' : 'lax',
            secure: isProd,
        });

        const { authentication: _, ...safeUser } = user.toObject();
        res.status(201).json(safeUser);
        return;

    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
}

export const login = async (req: express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ error: 'Email and password are required.' });
            return;
        }

        const user = await getUserByEmail(email).select('+authentication.password');
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }

        const isMatch = await comparePassword(password, user.authentication.password);
        if (!isMatch) {
            res.status(401).json({ error: 'Invalid credentials.' });
            return;
        }

        user.authentication.sessionToken = random();
        await user.save();

        const isProd = process.env.NODE_ENV === 'production';
        res.cookie('TEMPO-AUTH', user.authentication.sessionToken, {
            path: '/',
            sameSite: isProd ? 'none' : 'lax',
            secure: isProd,
        });

        const { authentication: _, ...safeUser } = user.toObject();
        res.status(200).json(safeUser);
        return;
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
    }
}