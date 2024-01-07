import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  OneToMany,
  JoinTable
} from 'typeorm';
import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum
} from 'class-validator';
import { RewardType } from './campaigns.constants';
// import { nanoid } from 'nanoid';
import {v4 as nanoid} from 'uuid';
import { User } from '../user/user.model';
import { Referrer } from '../referrals/models/referrer.model';
import { Referred } from '../referrals/models/referred.model';
import { generateRandomString } from 'src/common/utils/helper';

@Entity()
export class Campaign {
  @PrimaryColumn()
  id!: string;

  @ManyToOne(() => User, (user) => user.campaigns)
  @JoinColumn({ name: 'userId' })
  userId!: User;

  @Column({ unique: true })
  @IsNotEmpty()
  @MinLength(7, {
    message: 'A campaign name should have a minimum of 7 characters'
  })
  name!: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @MaxLength(255, {
    message: 'A campaign description should have a maximum of 255 characters'
  })
  description!: string;

  @Column({ type: 'enum', enum: RewardType, default: RewardType.CASH })
  @IsEnum(RewardType, { message: 'Invalid reward type' })
  @IsNotEmpty({ message: 'Please input a reward type' })
  reward!: RewardType;

  @Column()
  @MinLength(10, { message: 'The reward should be at least N10' })
  rewardAmount!: number;

  @ManyToMany(() => Referrer)
  @JoinTable()
  referrers!: Referrer[];

  @OneToMany(() => Referred, (referred) => referred.campaigns)
  referred!: Referred[];

  @Column()
  @IsFQDN()
  campaignLink!: string;

  @Column()
  @IsFQDN()
  paymentLink!: string;

  @Column({ default: true })
  active!: boolean;

  @Column()
  isDeleted!: boolean;

  @BeforeInsert()
  generateId() {
    this.id = generateRandomString();
  }
}
