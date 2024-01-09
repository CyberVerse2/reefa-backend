import jwt from 'jsonwebtoken';
import AppError from './../../common/utils/appError';
import { ENVIRONMENT } from '../../common/configs/environment';
import { Reefa } from '../../common/configs/db';
import { User } from '../user/user.model';
import { Campaign } from '../campaign/campaign.model';
import { compareData } from 'src/common/utils/helper';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm';

export async function findUser(
  value: string,
  field: string
): Promise<User | null> {
  const userRepository = Reefa.getRepository(User);
  const existingUser = await userRepository.findOneBy({ [field]: value });
  return existingUser;
}

export async function getUserCampaigns(id: string): Promise<Campaign[] | null> {
  const campaignRepository = await Reefa.getRepository(Campaign);
  const userCampaigns = await findUser(id, 'id');
  return userCampaigns?.campaigns ?? null;
}

export async function updateUser(
  id: string,
  details: QueryDeepPartialEntity<User>
): Promise<UpdateResult> {
  const userRepository = Reefa.getRepository(User);
  const updatedUser = await userRepository.update({ id }, details);
  console.log(updatedUser)
  const user = await userRepository.findOneBy({ id });
  console.log(user)
  return updatedUser;
}
