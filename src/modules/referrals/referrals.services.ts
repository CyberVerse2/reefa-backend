import { generate, charset as _charset } from 'referral-codes';

import { getCheckoutLink } from './referrals.utils';
import { getCampaignById } from '../campaign/campaign.services';
import { Reefa } from 'src/common/configs/db';
import { Referrer } from './models/referrer.model';
import { ReferrerCampaignStats } from './models/referrer-campaign-stats.model';
import AppError from 'src/common/utils/appError';
import { Referred } from './models/referred.model';
import { DeepPartial } from 'typeorm';
import { Campaign } from '../campaign/campaign.model';
import generateReferralCode from 'src/common/utils/generateReferralCodes';

export async function getReferrersByCampaign(id: string) {
  const campaign = await getCampaignById(id);
  const referrers = campaign?.referrers;
  return referrers ?? null;
}

export async function getReferrerByCode(code: string) {
  const referrerRepository = Reefa.getRepository(ReferrerCampaignStats);
  const referrer = await referrerRepository.findOneBy({ userCode: code });
  if (!referrer) throw new AppError('Referrer with this code not found', 404);
  return referrer;
}

export async function getReferrerById(id: string): Promise<Referrer | null> {
  const referrerRepository = Reefa.getRepository(Referrer);
  const referrer = await referrerRepository.findOneBy({ id });
  return referrer;
}
export async function getReferredByCampaigns(id: string) {
  const campaign = await getCampaignById(id);
  const referred = campaign?.referred;
  return referred ?? null;
}

export async function getReferredById(id: string): Promise<Referred | null> {
  const referredRepository = Reefa.getRepository(Referred);
  const referred = await referredRepository.findOneBy({ id });
  return referred;
}
interface NewReferrer extends Referrer {
  campaignId: Campaign['id'];
}
export async function createNewReferrer({
  campaignId,
  username,
  email,
  isTermsAndConditionAccepted
}: DeepPartial<NewReferrer>): Promise<Referrer> {
  const campaign = await getCampaignById(campaignId as string);
  if (!campaign) throw new AppError('Campaign not found', 404);
  const referrerRepository = Reefa.getRepository(Referrer);
  const referrerCampaignStatsRepository = Reefa.getRepository(ReferrerCampaignStats);
  const referrerCode = generateReferralCode();
  const newReferrer = referrerRepository.create({
    username,
    email,
    isTermsAndConditionAccepted
  });
  const campaignStats = referrerCampaignStatsRepository.create({
    user: newReferrer,
    campaign: campaign,
    userCode: referrerCode
  });
  await referrerCampaignStatsRepository.save(campaignStats);
  newReferrer.campaigns.push(campaign);
  newReferrer.stats.push(campaignStats);
  await referrerRepository.save(newReferrer);
  if (!newReferrer) throw new AppError('Error in saving referrer. Please try again');
  return newReferrer;
}
interface NewReferred extends Referred {
  campaignId?: Campaign['id'];
  checkoutLink?: string;
}
export async function createNewReferred({
  campaignId,
  username,
  email,
  productPrice,
  isTermsAndConditionAccepted
}: DeepPartial<NewReferred>): Promise<NewReferred> {
  const currentCampaign = await getCampaignById(campaignId!);
  const referredRepository = Reefa.getRepository(Referred);
  const newReferred = referredRepository.create({
    username,
    email,
    productPrice,
    isTermsAndConditionAccepted
  });
  currentCampaign?.referred.push(newReferred);
  await referredRepository.save(newReferred);
  const body = {
    customer_email: email,
    customer_name: username,
    country: 'Nigeria',
    amount: productPrice
  };
  const checkoutLink = await getCheckoutLink(body);
  if (!checkoutLink) throw new AppError('Error in getting checkout link');
  return { ...newReferred, checkoutLink };
}

export async function updateReferralCount(referralCode) {}

export async function validateReferral(email) {}
