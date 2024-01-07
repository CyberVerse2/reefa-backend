import { Router } from 'express';

import { httpCreateNewUser } from './auth.controllers';

const authRouter = Router();

authRouter.post('/signup', httpCreateNewUser);
// authRouter.post('/login', httpLoginUser);

export default authRouter;
