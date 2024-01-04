import { Router } from 'express';

import { httpGetDashboard } from './dashboard.controllers ';
import authenticateUser from '../globals/middlewares/authenticateUser.middleware ';

const dashboardRouter = Router();

dashboardRouter.use(authenticateUser);

dashboardRouter.post('/', httpGetDashboard);

export default dashboardRouter;
