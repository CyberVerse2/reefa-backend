import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany
} from 'typeorm';
import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { hash } from 'bcrypt';
import { Campaign } from '../campaign/campaign.model';
import { BaseUser } from '@/common/abstract/base-user.model';

@Entity()
export class User extends BaseUser {
  @Column()
  businessName!: string;

  @Column()
  @IsFQDN(undefined, {
    message: 'Social Link must be a site link eg instagram, facebook'
  })
  socialLink!: string;

  @OneToMany(() => Campaign, (campaign) => campaign.userId)
  campaigns!: Campaign[];

  @Column()
  @IsFQDN()
  photo!: string;

  @Column()
  @MinLength(10, { message: 'A account number must be 10 digits minimum' })
  accountNumber!: number;

  @Column()
  @IsNotEmpty()
  @MinLength(8, { message: 'password should be at least 8 characters long' })
  password!: string;

  @Column()
  isTermsAndConditionAccepted!: boolean;

  @Column()
  isDeleted!: boolean;

  @CreateDateColumn({ default: () => 'CURRENT_TIMESTAMP' })
  lastLogin!: Date;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }
}
