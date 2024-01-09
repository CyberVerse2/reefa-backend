import jwt from 'jsonwebtoken';
import AppError from './../../common/utils/appError';
import { ENVIRONMENT } from '../../common/configs/environment';
import { Reefa } from '../../common/configs/db';
import { User } from '../user/user.model';
import { compareData, validateEntity } from 'src/common/utils/helper';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { UpdateResult } from 'typeorm';
import { validate } from 'class-validator';

export async function findUser(
  value: string,
  field: string
): Promise<User | null> {
  const userRepository = Reefa.getRepository(User);
  const existingUser = await userRepository.findOneBy({ [field]: value });
  return existingUser;
}

export async function createNewUser(
  email: string,
  password: string,
  isTermsAndConditionAccepted: boolean
) {
  const user = await findUser(email, 'email');
  if (user) {
    throw new AppError('User already exists', 409);
  }
  const userRepository = await Reefa.getRepository(User);
  const newUser = await userRepository.create({
    email,
    password,
    isTermsAndConditionAccepted
  });
  await validateEntity(newUser);
  await userRepository.save(newUser);

  return newUser;
}

export async function loginUser(email: string, password: string) {
  const authenticatedUser = await findUser(email, 'email');
  if (!authenticatedUser) {
    throw new AppError('User not found', 404);
  }
  const isValidUser = await compareData(password, authenticatedUser.password);
  if (!isValidUser) {
    throw new AppError('The password is incorrect', 401);
  }

  return authenticatedUser;
}
