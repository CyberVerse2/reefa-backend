import { Router } from 'express';
import authRouter from './modules/auth/auth.router';
import userRouter from './modules/user/user.router';
import campaignRouter from './modules/campaign/campaign.router';
import referralsRouter from './modules/referrals/referrals.router';
import dashboardRouter from './modules/dashboard/dashboard.router';

const api = Router();

api.use('/auth', authRouter);
api.use('/user', userRouter);
api.use('/campaign', campaignRouter);
api.use('/referrals', referralsRouter);
api.use('/dashboard', dashboardRouter);

export default api;
