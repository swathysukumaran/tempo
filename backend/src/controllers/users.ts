
import { deleteUserById, getUserById } from '../db/users';
import express from 'express';

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const deletedUser = await deleteUserById(id);
        res.status(200).json(deletedUser);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete user' });
        return;
    }
}

export const updateUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;
        const { username } = req.body;
        if (!username) {
            res.status(400).json({ error: 'Username is required' });
            return;
        }
        const user = await getUserById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }
        user.username = username;
        await user.save();
        res.status(200).json(user);
        return;
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update user' });
        return;
    }
}