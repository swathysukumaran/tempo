import express from 'express';
import authentication from './authentication';
import AI from './AI';
import users from './users';


const router=express.Router();

export default():express.Router=>{
    authentication(router);
    AI(router);
    users(router);
    return router;
}