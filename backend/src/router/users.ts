
import { deleteUser } from 'controllers/users';
import express from 'express';
import { isAuthenticated, isOwner } from 'middlewares';

export default (router:express.Router)=>{
   
    router.delete('/users/:id',isOwner,deleteUser);
    
}

