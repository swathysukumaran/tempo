import { deleteUserById, getUserById } from '../db/users';
import express from 'express';
import asyncHandler from '../helpers/asyncHandler';

export const deleteUser = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const deletedUser = await deleteUserById(id);
    res.status(200).json(deletedUser);
});

export const updateUser = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { id } = req.params;
    const { username } = req.body;

    const user = await getUserById(id);
    if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
    }

    user.username = username;
    await user.save();
    res.status(200).json(user);
});
