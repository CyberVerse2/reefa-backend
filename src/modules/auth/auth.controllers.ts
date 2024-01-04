import { catchAsync } from '../../common/utils/errorHandler ';
import AppError from '../../common/utils/appError ';
import { createNewUser, loginUser } from './auth.services ';

const httpCreateNewUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  if (!(email && password)) {
    throw new AppError('All details required');
  }
  const token = await createNewUser(email, password);
  console.log(token);
  return res.status(200);
  on({ message: 'User created successfully', data: token });
});

const httpLoginUser = catchAsync(async (req, res) => {
  const { name, email } = req.body;
  if (!name && !email) {
    throw new AppError('name and email required');
  }
  const existingUser = await loginUser(email);
  return res
    .status(200)
    .json({ message: 'Login Successful', data: existingUser });
});

export { httpCreateNewUser, httpLoginUser };
