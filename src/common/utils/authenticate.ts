import { findUser } from 'src/modules/auth/auth.services';
import AppError from './appError';
import { User } from 'src/modules/user/user.model';
import { decodeData, signData } from './helper';
import { ENVIRONMENT } from '../configs/environment';
import { access } from 'fs';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

type AuthResponse = {
  currentUser: User;
  newAccessToken?: string;
};

export async function authenticate(
  accessToken: string,
  refreshToken: string
): Promise<AuthResponse> {
  if (!refreshToken) {
    throw new AppError('Unauthorized', 401);
  }
  const handleUserVerification = async (decoded) => {
    const currentUser = await findUser(decoded.id, 'id');
    if (!currentUser) {
      throw new AppError(`This user doesn't exist`, 404);
    }
    if (currentUser?.refreshToken !== refreshToken) {
      throw new AppError('Invalid token, Please log in again', 401);
    }
    return currentUser;
  };
  const handleAccessTokenRefresh = async () => {
    const decodedRefreshToken = decodeData(
      refreshToken,
      ENVIRONMENT.JWT.REFRESH_KEY
    );
    const currentUser = await handleUserVerification(decodedRefreshToken);
    const newAccessToken = signData(
      { id: currentUser.id },
      ENVIRONMENT.JWT.ACCESS_KEY,
      ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
    );
    if (newAccessToken) {
      return { newAccessToken, currentUser };
    }
    return { currentUser };
  };
  try {
    if (!accessToken) {
      return await handleAccessTokenRefresh();
    }
    const decodedAccessToken = decodeData(
      accessToken,
      ENVIRONMENT.JWT.ACCESS_KEY
    );
    const currentUser = await handleUserVerification(decodedAccessToken);
    return { currentUser };
  } catch (error) {
    if (
      (error instanceof JsonWebTokenError ||
        error instanceof TokenExpiredError ||
        error instanceof AppError) &&
      refreshToken
    ) {
      return await handleAccessTokenRefresh();
    } else {
      console.log(error);
      throw new AppError('Session Expired, please log in again', 401);
    }
  }
}
