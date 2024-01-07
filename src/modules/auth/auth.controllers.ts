import { catchAsync } from 'src/common/utils/catchAsync';
import AppError from '../../common/utils/appError';
import { createNewUser } from './auth.services';
import { Request, Response } from 'express';
import { AppResponse } from '../../common/utils/appResponse';

export const httpCreateNewUser = catchAsync(
  async (req: Request, res: Response) => {
    const { email, password, isTermsAndConditionAccepted } = req.body;
    console.log(email);
    if (!(email && password && isTermsAndConditionAccepted)) {
      throw new AppError('Please provide the required fields', 400);
    }
    const newUser = await createNewUser(email, password, isTermsAndConditionAccepted);
    console.log(newUser);
    return AppResponse(res, 200, newUser, 'User created successfully');
  }
);

// const httpLoginUser = catchAsync(async (req, res) => {
//   const { name, email } = req.body;
//   if (!name && !email) {
//     throw new AppError('name and email required');
//   }
//   const existingUser = await loginUser(email);
//   return res
//     .status(200)
//     .json({ message: 'Login Successful', data: existingUser });
// });
