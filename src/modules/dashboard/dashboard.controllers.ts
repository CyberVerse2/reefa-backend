import catchAsync from 'express-async-handler';

import { getDashboard } from './dashboard.services ';
import { NotFoundError } from '../globals/utils/errors.util ';

const httpGetDashboard = catchAsync(async (req, res) => {
  const { userId } = req;
  console.log(userId);
  if (!userId) {
    throw new NotFoundError('Your token has expired. Please login again');
  }
  const dashboard = await getDashboard(userId);

  return res.status(200).json(dashboard);
});

export { httpGetDashboard };
