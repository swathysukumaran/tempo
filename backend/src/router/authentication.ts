import express from 'express';
import { register, login } from '../controllers/authentication';
import { validate } from '../middlewares/validate';
import { registerSchema, loginSchema } from '../helpers/schemas';
import { loginLimiter, registerLimiter } from '../middlewares/rateLimiter';

export default (router:express.Router)=>{
    router.post('/auth/register', registerLimiter, validate(registerSchema), register);
    router.post('/auth/login', loginLimiter, validate(loginSchema), login);
    router.post('/auth/logout', (req, res) => {
        res.clearCookie('TEMPO-AUTH');
        res.status(200).json({ message: 'Logged out successfully' });
    });
};
