import express from 'express';
import mongoose from 'mongoose';

export default (router: express.Router) => {
    router.get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            uptime: process.uptime(),
            timestamp: new Date().toISOString(),
            db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
        });
    });
};
