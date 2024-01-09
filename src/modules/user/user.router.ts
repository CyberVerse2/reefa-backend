import { Router } from 'express';

import {
  httpGetCurrentUser,
  httpGetCampaigns,
  httpUpdateUser,
  httpDeleteUser
} from './user.controllers';
import { protect } from 'src/common/middlewares/protect';

const userRouter = Router();

userRouter.use(protect);

userRouter.post('/', httpGetCurrentUser);
userRouter.get('/campaigns', httpGetCampaigns);
userRouter.patch('/update', httpUpdateUser);
userRouter.delete('/delete', httpDeleteUser);

export default userRouter;
