// import {
//   getCampaigns,
//   getCampaignById,
//   createCampaign,
//   deleteCampaign
// } from './campaign.services';
// import { catchAsync } from 'src/common/utils/catchAsync';
// import AppError from 'src/common/utils/appError';
// import { Request, Response } from 'express';
// const httpGetCampaigns = catchAsync(async (req: Request, res: Response) => {
//   const { user } = req;
//   const currentCampaign = await getCampaigns(user.id!);
//   console.log(currentCampaign);
//   return res.status(200).json({
//     message: 'Campaigns retrieved succesfully',
//     data: currentCampaign
//   });
// });

// const httpGetCampaignById = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     throw new AppError('Campaign Id required');
//   }
//   const campaignById = await getCampaignById(id);
//   console.log(campaignById);
//   return res
//     .status(200)
//     .json({ message: 'Campaign retrieved succesfully', data: campaignById });
// });

// const httpCreateCampaign = catchAsync(async (req, res) => {
//   const { userId } = req;
//   const { name, description, campaignLink, paymentLink } = req.body;
//   if (!(name, description, campaignLink, paymentLink)) {
//     throw new AppError('Some details are missing in the Create Campaign form');
//   }
//   const newCampaign = await createCampaign(
//     userId,
//     name,
//     description,
//     campaignLink,
//     paymentLink
//   );
//   return res
//     .status(200)
//     .json({ message: 'Campaign Created Succesfully', newCampaign });
// });

// const httpDeleteCampaign = catchAsync(async (req, res) => {
//   const { id } = req.params;
//   if (!id) {
//     throw new AppError('Campaign Id required');
//   }
//   const deletedCampaign = await deleteCampaign(id);
//   console.log(deletedCampaign);
//   return res.status(200).json({
//     message: 'Campaign Deleted Successfully',
//     data: deletedCampaign
//   });
// });

// export {
//   httpGetCampaign,
//   httpGetCampaignById,
//   httpCreateCampaign,
//   httpDeleteCampaign
// };
