
import { deleteUser } from 'controllers/users';
import express from 'express';

export default (router:express.Router)=>{
   
    router.delete('/users/:id',deleteUser);
 
}

