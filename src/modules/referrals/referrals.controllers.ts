import catchAsync from 'express-async-handler';

import {
  createNewReferrer,
  getReferrers,
  getReferrerByCode,
  getReferred,
  getReferredById,
  createNewReferred
} from './referrals.services ';
import { AppError } from '../globals/utils/errors.util ';

const httpGetReferrers = catchAsync(async (req, res) => {
  const { campaignId } = req.body;
  if (!campaignId) {
    throw new AppError('Provide a campaign Id');
  }
  const referrers = await getReferrers(campaignId);
  return res
    .status(200)
    .json({ message: 'Referrers retrieved successfully', data: referrers });
});

const httpGetReferrerByCode = catchAsync(async (req, res) => {
  const { code } = req.params;
  console.log(code);
  if (!code) {
    throw new AppError('Provide a referral Code');
  }
  const referrersById = await getReferrerByCode(code);
  return res.status(200).json({
    message: 'Referrers based on referral code retrieved successfully',
    data: referrersById
  });
});

const httpCreateNewReferrer = catchAsync(async (req, res) => {
  const { campaignId, name, email } = req.body;

  if (!(name && email && campaignId)) {
    throw new AppError('name,email and campaignId required');
  }
  const newReferrer = await createNewReferrer(campaignId, name, email);
  return res
    .status(200)
    .json({ message: 'Registration Successful', data: newReferrer });
});

const httpGetReferred = catchAsync(async (req, res) => {
  const { campaignId } = req.body;
  if (!campaignId) {
    throw new AppError('Campaign Id required');
  }
  const referred = await getReferred(campaignId);

  return res.status(200).json({
    message: 'Referred of campaignId retrieved successfully',
    data: referred
  });
});

const httpGetReferredById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Referred Id required');
  }
  const referred = await getReferredById(id);

  return res
    .status(200)
    .json({ message: 'Referred retrieved successfully', data: referred });
});

const httpCreateNewReferred = catchAsync(async (req, res) => {
  const { campaignId, referralCode, name, email, amount } = req.body;
  if (!(name && email && campaignId && amount)) {
    throw new AppError('name and email required');
  }
  const newReferred = await createNewReferred(
    campaignId,
    name,
    email,
    amount,
    referralCode
  );
  return res.status(200).json({
    message: 'Registration of referred Successful',
    data: newReferred
  });
});

export {
  httpCreateNewReferrer,
  httpGetReferrers,
  httpGetReferrerByCode,
  httpGetReferred,
  httpGetReferredById,
  httpCreateNewReferred
};
