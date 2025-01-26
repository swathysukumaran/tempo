
import { deleteUserById } from 'db/users';
import express from 'express';

export const deleteUser=async(req:express.Request,res:express.Response)=>{
    try{
        const {id}=req.params;
        const deletedUser=await deleteUserById(id);
        res.json(deletedUser);
        return;

    }catch(error){
        console.log(error);
        res.sendStatus(400);
        return;
    }
}