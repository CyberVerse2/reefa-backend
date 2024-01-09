import { authenticate } from '../utils/authenticate';
import { catchAsync } from '../utils/catchAsync';
import type { NextFunction, Request, Response } from 'express';
import { setCookie } from '../utils/helper';
import { ENVIRONMENT } from '../configs/environment';

export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = catchAsync(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;
    const { currentUser, accessToken: reefaAccessToken } = await authenticate(
      accessToken,
      refreshToken
    );
    if (reefaAccessToken) {
      setCookie(res, 'accessToken', accessToken, {
        maxAge: parseInt(ENVIRONMENT.JWT_EXPIRES_IN.ACCESS)
      });
    }
    if (currentUser) {
      req.user = { id: currentUser.id };
    }
    next();
  }
);
