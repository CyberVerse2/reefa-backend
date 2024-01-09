import { findUser } from 'src/modules/auth/auth.services';
import AppError from './appError';
import { User } from 'src/modules/user/user.model';
import { decodeData, signData } from './helper';
import { ENVIRONMENT } from '../configs/environment';
import { access } from 'fs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

export async function authenticate(accessToken: string, refreshToken: string) {
  if (!refreshToken) {
    throw new AppError('Unauthorized', 401);
  }
  const handleUserVerification = async (decoded) => {
    const currentUser = await findUser(decoded.id, 'id');
    if (!currentUser) {
      throw new AppError(`This user doesn't exist`, 404);
    }
    if ((currentUser.refreshToken !== refreshToken)) {
      throw new AppError('Invalid token, Please log in again', 401);
    }
    return decoded;
  };
  const handleAccessTokenRefresh = async () => {
    try {
      const decodedRefreshToken = await decodeData(
        refreshToken,
        ENVIRONMENT.JWT.REFRESH_KEY
      );
      const currentUser = await handleUserVerification(decodedRefreshToken);
      const accessToken = signData(
        { id: currentUser.id },
        ENVIRONMENT.JWT.ACCESS_KEY,
        ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
      );
      if (accessToken) {
        return { accessToken, currentUser };
      }
    } catch (error) {
      throw new AppError('Session Expired, please log in again', 401);
    }
  };
  try {
    if (!accessToken) {
      return await handleAccessTokenRefresh();
    }
    const decodedAccessToken = await decodeData(
      accessToken,
      ENVIRONMENT.JWT.ACCESS_KEY
    );
    const currentUser = await handleUserVerification(decodedAccessToken);
    return currentUser;
  } catch (error) {
    if (
      (error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError) &&
      refreshToken
    )
      return await handleAccessTokenRefresh();
    else {
      throw new AppError('An error occurred, please log in again', 401);
    }
  }
}
