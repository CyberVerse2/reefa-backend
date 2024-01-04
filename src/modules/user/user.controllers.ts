import { getUser, updateUser, deleteUser } from './user.services';
import { catchAsync } from 'build/common/utils/errorHandler';
import { NotFoundError } from '../globals/utils/errors.util';

const httpGetUser = catchAsync(async (req, res) => {
  const { userId } = req;
  console.log(userId);
  if (!userId) {
    throw new NotFoundError('Your token has expired. Please login again');
  }
  const currentUser = await getUser(userId);

  return res
    .status(200)
    .json({ message: 'User Retrieved Succesfully', data: currentUser });
});

const httpUpdateUser = catchAsync(async (req, res) => {
  const { userId } = req;
  const { username, email, socialLink, accountNumber, businessName } =
    req.body || null;
  console.log(email);

  if (!userId) {
    throw new NotFoundError('Your token has expired. Please login again');
  }
  const updatedUser = await updateUser(
    userId,
    username,
    email,
    socialLink,
    accountNumber,
    businessName
  );
  return res
    .status(200)
    .json({ message: 'User updated succesfully', data: updatedUser });
});

const httpDeleteUser = catchAsync(async (req, res) => {
  const { userId } = req;
  if (!userId) {
    throw new NotFoundError('Your token has expired. Please login again');
  }
  const deletedUser = await deleteUser(userId);
  return res.status(200).json({ message: 'User Deleted Successfully' });
});

export { httpGetUser, httpUpdateUser, httpDeleteUser };
