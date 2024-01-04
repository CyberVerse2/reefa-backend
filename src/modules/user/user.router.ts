import { Router } from 'express';

import {
  httpGetUser,
  httpUpdateUser,
  httpDeleteUser
} from './user.controllers ';
import authenticateUser from '../globals/middlewares/authenticateUser.middleware ';
import validateData from '../globals/middlewares/validation.middleware ';
import userSchema from './user.validation ';

const userRouter = Router();

userRouter.use(authenticateUser);

userRouter.post('/', httpGetUser);
userRouter.put(
  '/update',
  (req, res, next) => validateData(userSchema, req, res, next),
  httpUpdateUser
);
userRouter.delete('/delete', httpDeleteUser);

export default userRouter;
