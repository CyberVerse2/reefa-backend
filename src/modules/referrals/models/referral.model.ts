import {
  Entity,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  UpdateDateColumn,
  ManyToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from "typeorm";
import { IsEmail, IsFQDN, IsNotEmpty, MinLength } from "class-validator";
import { hash } from "bcryptjs";
import { Campaign } from "../../../modules/campaign/campaign.model";
import { BaseUser } from "../../../common/abstract/base-user.model";
import { ReferrerCampaignStats } from "./referrer-campaign-stats.model";
import { Referrer } from "./referrer.model";
import { Referred } from "./referred.model";

Entity();
export class Referral {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @OneToOne(() => Campaign)
  @JoinColumn({ name: "campaignId" })
  campaign!: Campaign;

  @OneToOne(() => Referrer)
  @JoinColumn({ name: "referrerId" })
  referrer!: Referrer;

  @OneToOne(() => Referred)
  @JoinColumn({ name: "referred" })
  referred!: Referred;

  @OneToOne(() => ReferrerCampaignStats)
  @JoinColumn({ name: "referralCode" })
  referralCode!: ReferrerCampaignStats;

  @Column()
  ipAddress!: string;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
