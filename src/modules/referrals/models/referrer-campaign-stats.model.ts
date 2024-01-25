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
import { Referred } from "./referred.model";
import { Referrer } from "./referrer.model";
import { Referral } from "./referral.model";
@Entity()
export class ReferrerCampaignStats {
  @PrimaryGeneratedColumn("uuid")
  id!: number;

  @ManyToOne(() => Referrer, (referrer) => referrer.stats)
  @JoinColumn({ name: "statsId" })
  user!: Referrer;

  @OneToOne(() => Campaign)
  @JoinColumn({ name: "campaignId" })
  campaign!: Campaign;

  @OneToMany(() => Referred, (referred) => referred.referrerCode)
  userCode!: string;

  @Column({ default: 0 })
  invitesMade!: number;

  @Column({ default: 0 })
  rewardsEarned!: number;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
