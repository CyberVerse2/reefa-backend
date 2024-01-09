import { authenticate } from '../utils/authenticate';
import { catchAsync } from '../utils/catchAsync';
import type { NextFunction, Request, Response } from 'express';
import { setCookie } from '../utils/helper';
import { ENVIRONMENT } from '../configs/environment';

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    const { currentUser, newAccessToken } = await authenticate(
      accessToken,
      refreshToken
    );
    // console.log(currentUser);
    // console.log(newAccessToken)
    if (newAccessToken) {
      setCookie(res, 'accessToken', newAccessToken, { maxAge: 15 * 60 * 1000 });
      console.log(newAccessToken, 'cookie was created');
    }
    if (currentUser) {
      req.user = { id: currentUser.id };
    }
    next();
  }
);
