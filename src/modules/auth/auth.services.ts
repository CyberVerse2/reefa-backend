import jwt from 'jsonwebtoken';
import AppError from './../../common/utils/appError';
import { ENVIRONMENT } from './../../common/config/environment';
import { Reefa } from './../../common/config/db';
import { User } from '../user/user.model';

export async function findUser(email: string): Promise<User | null> {
  const userRepository = Reefa.getRepository(User);
  const existingUser = await userRepository.findOneBy({ email });
  return existingUser;
}

export async function createNewUser(
  email: string,
  password: string,
  isTermsAndConditionAccepted: boolean
) {
  const user = await findUser(email);
  if (user) {
    throw new AppError('User already exists', 409);
  }
  const userRepository = await Reefa.getRepository(User);
  const newUser = await userRepository.create({
    email,
    password,
    isTermsAndConditionAccepted
  });
  await userRepository.save(newUser);

  return newUser;
}

// async function loginUser(ownerEmail) {
//   console.log(ownerEmail, password);
//   const authenticatedUser = await findUser(ownerEmail);
//   console.log(authenticatedUser);
//   if (
//     authenticatedUser.length === 0 &&
//     authenticatedUser.password !== password
//   ) {
//     throw new AppError('User does not exist. Please register an account');
//   }
//   const token = jwt.sign(
//     { userId: authenticatedUser.owner_id },
//     process.env.COOKIE_SECRET_KEY,
//     {
//       expiresIn: '24h'
//     }
//   );
//   return token;
// }

// export { createNewUser, loginUser };
