import express from 'express';
import authentication from './authentication';
import AI from './AI';
import users from './users';
import tripDetails from './tripDetails';
import onboarding from './onboarding';
import preferences from './preferences';


const router=express.Router();

export default():express.Router=>{
    authentication(router);
    AI(router);
    users(router);
    tripDetails(router);
    preferences(router);
    onboarding(router);
    return router;
}