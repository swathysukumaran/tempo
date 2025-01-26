import express from 'express';

import { register } from '../controllers/authentication';
import { getUserByEmail } from 'db/users';
import { authentication, random } from 'helpers';

export const login=async (req:express.Request,res:express.Response)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            res.status(400);
            return;
        }
        const user=await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            res.status(400);
            return;
        }
        const expectedHash=authentication(user.authentication.salt,password);
        if(expectedHash!=user.authentication.password){
            res.status(403);
            return;
        }

        const salt=random();
        user.authentication.sessionToken=authentication(salt,user._id.toString());
        await user.save();
    }catch(error){
        console.error('Login Error:', error);
        res.status(400);
        return;
    }
}

export default (router:express.Router)=>{
    router.post('/auth/register',register);
};
