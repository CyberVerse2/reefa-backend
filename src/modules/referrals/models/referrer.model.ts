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
  JoinTable,
} from "typeorm";
import { IsEmail, IsFQDN, IsNotEmpty, MinLength } from "class-validator";
import { Campaign } from "../../../modules/campaign/campaign.model";
import { BaseUser } from "../../../common/abstract/base-user.model";
import { ReferrerCampaignStats } from "./referrer-campaign-stats.model";

@Entity()
export class Referrer extends BaseUser {
  @ManyToMany(() => Campaign)
  @JoinTable()
  campaigns!: Campaign[];

  @OneToMany(() => ReferrerCampaignStats, (stats) => stats.user)
  stats!: ReferrerCampaignStats[];

  @Column({ nullable: true })
  @IsFQDN()
  photo!: string;

  @Column({ nullable: true })
  @IsNotEmpty()
  @MinLength(8, { message: "password should be at least 8 characters long" })
  password!: string;

  @Column()
  isTermsAndConditionAccepted!: boolean;

  @Column({ default: false })
  isSuspended!: boolean;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  createdAt!: Date;

  @UpdateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  updatedAt!: Date;
}
