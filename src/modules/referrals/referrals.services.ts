import { getCheckoutLink } from './referrals.utils';
import { getCampaignById } from '../campaign/campaign.services';
import { Reefa } from '../../common/configs/db';
import { Referrer } from './models/referrer.model';
import { ReferrerCampaignStats } from './models/referrer-campaign-stats.model';
import AppError from '../../common/utils/appError';
import { Referred } from './models/referred.model';
import { Campaign } from '../campaign/campaign.model';
import generateReferralCode from '../../common/utils/generateReferralCodes';
import { Referral } from './models/referral.model';

export async function getReferrersByCampaign(id: string) {
  const campaign = await getCampaignById(id);
  const referrers = campaign?.referrers;
  return referrers ?? null;
}

export async function getReferrerStatsByCode(code: string) {
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

interface ref {
  campaignId: string;
  username: string;
  email: string;
  isTermsAndConditionAccepted: boolean;
}
export async function createNewReferrer(
  campaignId: string,
  username: string,
  email: string,
  isTermsAndConditionAccepted: boolean
): Promise<Referrer> {
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
export async function createNewReferred(
  campaignId: string,
  username: string,
  email: string,
  productPrice: number,
  referralCode: string,
  isTermsAndConditionAccepted: boolean
): Promise<NewReferred> {
  const currentCampaign = await getCampaignById(campaignId);
  const statsRepository = await Reefa.getRepository(ReferrerCampaignStats);
  const stats = await getReferrerStatsByCode(referralCode);
  if (!stats) throw new AppError('Referrer with the id was not found', 400);

  const referredRepository = Reefa.getRepository(Referred);
  const newReferred = referredRepository.create({
    username,
    email,
    productPrice,
    isTermsAndConditionAccepted
  });
  currentCampaign?.referred.push(newReferred);
  await referredRepository.save(newReferred);
  stats.referred = newReferred;
  await statsRepository.save(stats);
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

export async function updateReferralCount(ip: string, email: string): Promise<Referral> {
  const referralCampaignStatsRepository = Reefa.getRepository(ReferrerCampaignStats);
  const referredRepository = Reefa.getRepository(Referred);
  const referred = await referredRepository.findOneBy({ email });
  if (!referred) throw new AppError('The referred with this email was not found', 400);

  const stats = await referralCampaignStatsRepository.findOneBy({ referred });
  if (!stats) throw new AppError('The referrer stats with this email was not found', 400);

  const updatedReferralCampaignStats = await referralCampaignStatsRepository.update(
    { referred },
    {
      invitesMade: stats.invitesMade + 1,
      rewardsEarned: stats.rewardsEarned + 1,
      verified: true
    }
  );

  const referralRepository = Reefa.getRepository(Referral);
  const newReferral = referralRepository.create({
    campaign: stats.campaign,
    referrer: stats.user,
    referred: stats.referred,
    referralCode: stats,
    ipAddress: ip
  });
  await referralRepository.save(newReferral);
  return newReferral;
}
