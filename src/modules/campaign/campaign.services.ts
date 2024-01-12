import axios from 'axios';
import { createPaymentLink } from './campaign.utils';
import { Campaign } from './campaign.model';
import { Reefa } from 'src/common/configs/db';
import { findUser } from '../user/user.services';
import AppError from 'src/common/utils/appError';
import { BusinessCategory, RewardType } from './campaigns.constants';
import { DeepPartial, UpdateResult } from 'typeorm';
export async function getCampaignById(id: string): Promise<Campaign | null> {
  const campaignRepository = await Reefa.getRepository(Campaign);
  const userCampaigns = await campaignRepository.findOneBy({ id });
  return userCampaigns;
}

export async function createCampaign({
  userId,
  name,
  description,
  category,
  reward,
  rewardAmount
}: DeepPartial<Campaign>): Promise<Campaign> {
  const currentUser = await findUser(<string>userId, 'id');
  if (!currentUser)
    throw new AppError(`This user creating the campaign doesn't exist`);

  const CampaignRepository = await Reefa.getRepository(Campaign);
  const newCampaign = await CampaignRepository.create({
    userId: currentUser,
    name,
    description,
    category,
    reward,
    rewardAmount
  });
  await CampaignRepository.save(newCampaign)
  if (!newCampaign) throw new AppError('Error in creating campaign. Please try again', 400)
  

  return newCampaign;
}

export async function updateCampaign(
  id: string,
  details: DeepPartial<Campaign>
): Promise<UpdateResult> {
  const CampaignRepository = await Reefa.getRepository(Campaign);
  const updatedCampaign = await CampaignRepository.update({ id }, details);
  if (!updatedCampaign)
    throw new AppError('Error in updating campaign. Please try again', 400);
  return updatedCampaign;
}

export async function deleteCampaign(id: string) {
  const CampaignRepository = await Reefa.getRepository(Campaign);
  const deletedCampaign = await CampaignRepository.update({ id }, {
    isDeleted: true
  });
  if (!deletedCampaign) throw new AppError('Error in deleting campaign', 400);
  return deletedCampaign;
}
