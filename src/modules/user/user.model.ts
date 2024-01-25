import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  BeforeUpdate,
} from "typeorm";
import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  MinLength,
  ValidateIf,
} from "class-validator";
import { hash } from "bcrypt";
import { Campaign } from "../campaign/campaign.model";
import { BaseUser } from "../../common/abstract/base-user.model";

@Entity()
export class User extends BaseUser {
  @Column({ nullable: true })
  businessName!: string;

  @Column({ nullable: true })
  socialLink!: string;

  @OneToMany(() => Campaign, (campaign) => campaign.userId)
  campaigns!: Campaign[];

  @Column({ nullable: true })
  photo?: string;

  @Column({ nullable: true })
  accountNumber!: number;

  @Column({ nullable: true })
  password!: string;

  @Column()
  isTermsAndConditionAccepted!: boolean;

  @Column({ nullable: true })
  refreshToken!: string;

  @Column({ default: false })
  isDeleted!: boolean;

  @CreateDateColumn({ default: () => "CURRENT_TIMESTAMP" })
  lastLogin!: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await hash(this.password, 10);
    }
  }
}
