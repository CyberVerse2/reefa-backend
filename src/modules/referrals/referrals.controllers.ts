import { catchAsync } from 'src/common/utils/catchAsync';

import {
  createNewReferrer,
  getReferrerByCode,
  getReferredById,
  createNewReferred,
  getReferrersByCampaign,
  getReferrerById,
  getReferredByCampaigns
} from './referrals.services';
import AppError from 'src/common/utils/appError';
import { AppResponse } from 'src/common/utils/appResponse';
import { Referrer } from './models/referrer.model';
import { Campaign } from '../campaign/campaign.model';

export const httpGetReferrersByCampaign = catchAsync(async (req, res) => {
  const { campaignId } = req.body;
  if (!campaignId) {
    throw new AppError('Provide a campaign Id');
  }
  const referrers = await getReferrersByCampaign(campaignId);
  if (!referrers) throw new AppError('Referrers with the campaign id not found', 400);
  return AppResponse(res, 200, referrers, 'Referrers retrieved successfully');
});

export const httpGetReferrerByCode = catchAsync(async (req, res) => {
  const { code } = req.params;
  console.log(code);
  if (!code) {
    throw new AppError('Provide a referral Code');
  }
  const referrersById = await getReferrerByCode(code);
  return AppResponse(
    res,
    200,
    referrersById,
    'Referrers based on referral code retrieved successfully'
  );
});

export const httpGetReferrerById = catchAsync(async (req, res) => {
  const { id } = req.params;
  console.log(id);
  if (!id) {
    throw new AppError('Provide a referral id');
  }
  const referrersById = await getReferrerById(id);
  if (!referrersById) throw new AppError('Referred with the id not found', 404);

  return AppResponse(
    res,
    200,
    referrersById,
    'Referrers based on referrer id retrieved successfully'
  );
});

export const httpCreateNewReferrer = catchAsync(async (req, res) => {
  const { campaignId, name, email, isTermsAndConditionAccepted } = req.body;

  if (!(name && email && campaignId)) {
    throw new AppError('name,email and campaignId required');
  }

  const newReferrer = await createNewReferrer(campaignId, name, email, isTermsAndConditionAccepted);
  return AppResponse(res, 200, newReferrer, 'Registration Successful');
});

export const httpGetReferredByCampaign = catchAsync(async (req, res) => {
  const { campaignId } = req.body;
  if (!campaignId) {
    throw new AppError('Campaign Id required');
  }
  const referred = await getReferredByCampaigns(campaignId);
  if (!referred) throw new AppError('Referred with the id not found', 400);

  return AppResponse(res, 200, referred, 'Referred of campaignId retrieved successfully');
});

export const httpGetReferredById = catchAsync(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError('Referred Id required');
  }
  const referred = await getReferredById(id);
  if (!referred) throw new AppError('Referred with the id not found', 404);

  return AppResponse(res, 200, referred, 'Referred retrieved successfully');
});

export const httpCreateNewReferred = catchAsync(async (req, res) => {
  const { campaignId, referralCode, name, email, amount } = req.body;
  if (!(name && email && campaignId && amount)) {
    throw new AppError('name and email required');
  }
  const newReferred = await createNewReferred(campaignId, name, email, amount, referralCode);
  return AppResponse(res, 201, newReferred, 'Registration of referred Successful');
});
