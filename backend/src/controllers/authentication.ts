import express from 'express';
import { createUser,getUserByEmail } from '../db/users';
import { random,authentication } from '../helpers';

export const register: express.RequestHandler = async(req:express.Request,res:express.Response)=>{
    try{
        const {email,password,username}=req.body;

        if(!email||!password||!username){
            res.status(400).json({ error: 'Missing required fields' });
            return; // Ensure no further execution
        }
        const existingUser=await getUserByEmail(email);

        if(existingUser){
            res.status(400).json({ error: 'User already exists' });
            return;
        }

        const salt=random();
        const user= await createUser({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password),
            }
        });
        res.status(201).json(user); // Send the response
        return;

    }catch(error){
        console.log(error);
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error' }); // Handle errors
        return;
    }
}