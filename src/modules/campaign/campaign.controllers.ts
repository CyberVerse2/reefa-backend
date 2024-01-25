import {
  getCampaignById,
  createCampaign,
  deleteCampaign,
  updateCampaign
} from './campaign.services';
import { catchAsync } from '../../common/utils/catchAsync';
import AppError from '../../common/utils/appError';
import { Request, Response } from 'express';
import { AppResponse } from '../../common/utils/appResponse';
import { User } from '../user/user.model';
import { DeepPartial } from 'typeorm';
import { validateEntity } from '../../common/utils/helper';
import { CreateCampaignDto } from './dto/createcampaign.dto';
import { UpdateCampaignDto } from './dto/updatecampaign.dto';

export const httpGetCampaignById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Campaign Id required');
  }
  const campaignById = await getCampaignById(id);
  return AppResponse(res, 200, campaignById, 'Campaign Retrieved Successfully');
});

export const httpCreateCampaign = catchAsync(async (req: Request, res: Response) => {
  const { user } = req;
  const { name, description, category, reward, rewardAmount } = req.body;
  if (!(name && description && category && reward && rewardAmount)) {
    throw new AppError('Please input all required fields', 400);
  }
  await validateEntity(new CreateCampaignDto(req.body));
  const newCampaign = await createCampaign({
    userId: <DeepPartial<User>>user.id,
    name,
    description,
    category,
    reward,
    rewardAmount
  });
  return AppResponse(res, 201, newCampaign, 'Campaign Created Successfully');
});

export const httpUpdateCampaign = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, category, reward, rewardAmount, campaignLink, paymentLink, active } =
    req.body;
  if (
    !(
      id ||
      name ||
      description ||
      category ||
      reward ||
      rewardAmount ||
      campaignLink ||
      paymentLink ||
      active
    )
  ) {
    throw new AppError('Please input at least one field', 400);
  }
  const details = {
    name,
    description,
    category,
    reward,
    rewardAmount,
    campaignLink,
    paymentLink,
    active
  };

  type NonNullableObject<T> = {
    [K in keyof T]: NonNullable<T[K]>;
  };
  const nonNullableDetails: NonNullableObject<typeof details> = details;
  await validateEntity(new UpdateCampaignDto(nonNullableDetails));
  const updatedCampaign = await updateCampaign(id, {
    name,
    description,
    category,
    reward,
    rewardAmount
  });
  return AppResponse(res, 200, updatedCampaign, 'Campaign Updated Successfully');
});

export const httpDeleteCampaign = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('The id of the campaign is required', 400);
  }
  const deletedCampaign = await deleteCampaign(id);
  console.log(deletedCampaign);
  return AppResponse(res, 200, deletedCampaign, 'Campaign Deleted Successfully');
});
