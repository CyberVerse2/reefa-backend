import jwt from 'jsonwebtoken';
import AppError from './../../common/utils/appError';
import { ENVIRONMENT } from '../../common/configs/environment';
import { Reefa } from '../../common/configs/db';
import { User } from '../user/user.model';
import { Campaign } from '../campaign/campaign.model';
import { compareData } from '../../common/utils/helper';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm';
import { validate } from 'class-validator';

export async function findUser(value: string, field: string): Promise<User | null> {
  const userRepository = Reefa.getRepository(User);
  const existingUser = await userRepository.findOneBy({ [field]: value });
  if (!existingUser) throw new AppError('User not found', 404);
  return existingUser;
}

export async function getUserCampaigns(id: string): Promise<Campaign[] | null> {
  const currentUser = await findUser(id, 'id');
  return currentUser?.campaigns ?? null;
}

export async function updateUser(
  id: string,
  details: QueryDeepPartialEntity<User>
): Promise<UpdateResult> {
  const userRepository = Reefa.getRepository(User);
  const errors = await validate(details);
  console.log(errors);
  const updatedUser = await userRepository.update({ id }, details);
  if (!updatedUser) throw new AppError('Error in updating user. Please try again', 400);
  return updatedUser;
}
