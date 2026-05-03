import express from 'express';
import { createUser, getUserByEmail } from '../db/users';
import { random, hashPassword, comparePassword } from '../helpers';
import asyncHandler from '../helpers/asyncHandler';

export const register = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, password, username } = req.body;

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
        httpOnly: true,
        path: '/',
        sameSite: isProd ? 'none' : 'lax',
        secure: isProd,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const { authentication: _, ...safeUser } = user.toObject();
    res.status(201).json(safeUser);
});

export const login = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { email, password } = req.body;

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
});
