import express from 'express';
import {login,register} from '../Controller/registration.js'
import { addToUserHistory, getUserHistory } from '../Controller/historyDetail.js';

const route=express.Router();

route.post('/login',login);
route.post('/signup',register);
route.post('/add_to_activity',addToUserHistory);
route.get('/get_all_activity',getUserHistory);

export default route;