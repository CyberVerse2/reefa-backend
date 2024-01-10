import { catchAsync } from 'src/common/utils/catchAsync';
import AppError from '../../common/utils/appError';
import { createNewUser, loginUser } from './auth.services';
import { updateUser } from '../user/user.services';
import { Request, Response } from 'express';
import { AppResponse } from '../../common/utils/appResponse';
import { setCookie, signData, validateEntity } from 'src/common/utils/helper';
import { ENVIRONMENT } from 'src/common/configs/environment';
import { EntityTransformer } from 'src/common/transformers/entityTransformer';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

export const httpCreateNewUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, isTermsAndConditionAccepted } = req.body;
    await validateEntity(new SignupDto(req.body));
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

export const httpLoginUser = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  await validateEntity(new LoginDto(req.body));
  if (!email && !password) {
    throw new AppError('email and password required');
  }

  const user = await loginUser(email, password);
  const accessToken = signData(
    { id: user.id },
    ENVIRONMENT.JWT.ACCESS_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.ACCESS
  );
  setCookie(res, 'accessToken', accessToken, { maxAge: 15 * 60 * 1000 });
  const refreshToken = signData(
    { id: user.id },
    ENVIRONMENT.JWT.REFRESH_KEY,
    ENVIRONMENT.JWT_EXPIRES_IN.REFRESH
  );
  setCookie(res, 'refreshToken', refreshToken, { maxAge: 24 * 60 * 1000 });
  const updatedUser = await updateUser(user.id, {
    refreshToken,
    lastLogin: new Date()
  });
  console.log(updatedUser);
  return AppResponse(
    res,
    200,
    EntityTransformer(user),
    'User logged in successfully'
  );
});
