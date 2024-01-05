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
  OneToOne
} from 'typeorm';
import { Campaign } from '@/modules/campaign/campaign.model';
import { BaseUser } from '@/common/abstract/base-user.model';
import { ReferrerCampaignStats } from './referrer-campaign-stats.model';

@Entity()
export class Referred extends BaseUser {
  @ManyToOne(
    () => ReferrerCampaignStats,
    (campaignStats) => campaignStats.userCode
  )
  @JoinColumn({ name: 'ReferrerCampaignStatsId' })
  referrerCode!: ReferrerCampaignStats;

  @ManyToOne(() => Campaign, (campaign) => campaign.referred)
  @JoinColumn({ name: 'campaignId' })
  campaigns!: Campaign;

  @Column()
  isTermsAndConditionAccepted!: boolean;

  @Column()
  isDeleted!: boolean;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  createdAt!: Date;

  @UpdateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  updatedAt!: Date;
}
