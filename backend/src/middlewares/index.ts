import express from 'express';
import {get,identity,merge} from 'lodash';
import {getUserBySessionToken} from '../db/users';

export const isAuthenticated=async(req:express.Request,res:express.Response,next:express.NextFunction)=>{

    try{
        const sessionToken=req.cookies['TEMPO-AUTH'];
        if(!sessionToken){
            res.status(401).json({error:'Unauthorized'});
            return;
        }
        const existingUser=await getUserBySessionToken(sessionToken);
        if(!existingUser){
            res.status(401).json({error:'Unauthorized'});
            return;
        }
        merge(req,{identity:existingUser});
        return next();
    }catch(error){
        console.error('Authentication Error:',error);
        res.status(500).json({error:'Internal Server Error'});
        return

    }
}