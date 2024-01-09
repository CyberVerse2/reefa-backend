import { catchAsync } from 'src/common/utils/catchAsync';
import AppError from '../../common/utils/appError';
import { createNewUser, loginUser, updateUser } from './auth.services';
import { Request, Response } from 'express';
import { AppResponse } from '../../common/utils/appResponse';
import { setCookie, signData } from 'src/common/utils/helper';
import { ENVIRONMENT } from 'src/common/configs/environment';
import { EntityTransformer } from 'src/common/transformers/entityTransformer';

export const httpCreateNewUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, isTermsAndConditionAccepted } = req.body;
    console.log(email);
    if (!(email && password && isTermsAndConditionAccepted)) {
      throw new AppError('Please provide the required fields', 400);
    }
    const newUser = await createNewUser(
      email,
      password,
      isTermsAndConditionAccepted
    );
    console.log(newUser);
    return AppResponse(res, 200, newUser, 'User created successfully');
  }
);

export const httpLoginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!email && !password) {
    throw new AppError('email and password required');
  }
  const user = await loginUser(email, password);
  const accessToken = signData(
    { id: user.id },
    ENVIRONMENT.JWT.ACCESS_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
  );
  setCookie(res, 'access_token', accessToken);
  console.log(ENVIRONMENT.JWT.REFRESH_KEY);
  const refreshToken = signData(
    { id: user.id },
    ENVIRONMENT.JWT.REFRESH_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.REFRESH
  );
  setCookie(res, 'refresh_token', refreshToken);
  const updatedUser = await updateUser(user.id, {
    refreshToken,
    lastLogin: new Date()
  });
  return AppResponse(
    res,
    200,
    EntityTransformer(user),
    'User logged in successfully'
  );
});
