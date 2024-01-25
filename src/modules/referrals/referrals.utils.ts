import axios from 'axios';
import { findUser } from '../user/user.services';
import AppError from '../../common/utils/appError';
import { ENVIRONMENT } from '../../common/configs/environment';

async function getCheckoutLink(body: any) {
  const data = JSON.stringify(body);
  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.blochq.io/v1/checkout/new',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ENVIRONMENT.BLOC.LIVE.PUBLIC_KEY}`
    },
    data: data
  };

  try {
    const response = await axios(config);
    console.log(response);
    const checkoutLink = response.data?.data;
    return checkoutLink;
  } catch (error) {
    throw new AppError(error as string);
  }
}

export { getCheckoutLink };
