import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BeforeInsert,
  OneToMany,
  BeforeUpdate
} from 'typeorm';
import {
  IsEmail,
  IsFQDN,
  IsNotEmpty,
  MinLength,
  IsOptional,
  Length,
  ValidateIf,
  IsUrl,
  Min,
  Max
} from 'class-validator';
import { BaseDto } from '../../../common/dto/base.dto';

export class UpdateUserDto extends BaseDto {
  constructor(body: any) {
    super(body);
    this.assignBody();
  }

  @Length(8, 20, { message: 'Username must be between 8 and 20 characters' })
  @IsOptional()
  username!: string;

  @IsEmail(undefined, { message: 'Email is not valid' })
  @IsOptional()
  email!: string;

  businessName!: string;

  @IsUrl(undefined, {
    message: 'Social Link must be a site link eg instagram, facebook'
  })
  @IsOptional()
  socialLink!: string;

  @IsUrl()
  @IsOptional()
  photo?: string;

  @Min(1000000000, { message: 'A account number must be 10 digits minimum' })
  @Max(9999999999)
  @IsOptional()
  accountNumber!: number;

  @MinLength(8, { message: 'password should be at least 8 characters long' })
  @IsOptional()
  password!: string;
}
