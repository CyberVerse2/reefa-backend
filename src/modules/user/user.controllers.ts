import AppError from 'src/common/utils/appError';
import { findUser, updateUser, getUserCampaigns } from './user.services';
import { Request, Response } from 'express';
import { catchAsync } from 'src/common/utils/catchAsync';
import { AppResponse } from 'src/common/utils/appResponse';

const httpGetCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;

  const currentUser = await findUser(user.id!, 'id');
  if (!currentUser) {
    throw new AppError('The user not found', 400);
  }

  return AppResponse(res, 200, currentUser, 'User found');
});
export const httpGetCampaigns = catchAsync(
  async (req: Request, res: Response) => {
    const { user } = req;
    const currentCampaign = await getUserCampaigns(user.id!);
    if (!currentCampaign) {
      return AppResponse(res, 400, null, 'No campaigns found for this user');
    }
    console.log(currentCampaign);
    return AppResponse(
      res,
      200,
      currentCampaign,
      'Campaigns retrieved succesfully'
    );
  }
);
const httpUpdateUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { username, email, socialLink, accountNumber, businessName } =
    req.body || null;
  const details = {
    username,
    email,
    socialLink,
    accountNumber,
    businessName
  };
  const updatedUser = await updateUser(user.id!, details);
  return AppResponse(res, 200, updatedUser, 'User updated successfully');
});

const httpDeleteUser = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const deletedUser = await updateUser(user.id!, { isDeleted: true });
  return AppResponse(res, 200, deletedUser, 'User Deleted Successfully');
});

export { httpGetCurrentUser, httpUpdateUser, httpDeleteUser };
