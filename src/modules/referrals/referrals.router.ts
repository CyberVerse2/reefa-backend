import { Router } from "express";

import {
  httpCreateNewReferrer,
  httpGetReferrerById,
  httpGetReferrersByCampaign,
  httpGetReferrerByCode,
  httpCreateNewReferred,
  httpGetReferredByCampaign,
  httpGetReferredById,
} from "./referrals.controllers";

const referralsRouter = Router();

referralsRouter.get("/referrers/:id", httpGetReferrerById);
referralsRouter.post("/referrers/:code", httpGetReferrerByCode);
referralsRouter.post("/referrers", httpGetReferrersByCampaign);
referralsRouter.post("/referrer/create", httpCreateNewReferrer);

referralsRouter.get("/referred/:id", httpGetReferredById);
referralsRouter.post("/referred", httpGetReferredByCampaign);
referralsRouter.post("/referred/create", httpCreateNewReferred);

export default referralsRouter;
