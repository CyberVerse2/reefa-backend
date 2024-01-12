import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsUrl,
  Contains,
  Max,
  Min
} from 'class-validator';
import { BaseDto } from 'src/common/dto/base.dto';
import { BusinessCategory, RewardType } from '../campaigns.constants';

export class UpdateCampaignDto extends BaseDto {
  constructor(body: any) {
    super(body);
    this.assignBody();
  }

  @IsNotEmpty()
  @MinLength(7, {
    message: 'A campaign name should have a minimum of 7 characters'
  })
  @IsOptional()
  name!: string;

  @IsNotEmpty()
  @MaxLength(255, {
    message: 'A campaign description should have a maximum of 255 characters'
  })
  @IsOptional()
  description!: string;

  @IsUrl(undefined, { message: 'This is not a valid photo url' })
  @IsOptional()
  photo?: string;

  @IsEnum(BusinessCategory, { message: 'Invalid category' })
  @IsOptional()
  category!: BusinessCategory;

  @IsEnum(RewardType, { message: 'Invalid reward type' })
  @IsOptional()
  reward!: RewardType;

  @Min(10, { message: 'A account number must be 10 digits minimum' })
  @Max(10000)
  rewardAmount!: number;

  @IsUrl(undefined, { message: 'This is not a valid campaign url' })
  @Contains('reefa', { message: 'This is not a valid payment link' })
  @IsOptional()
  campaignLink!: string;

  @IsUrl(undefined, { message: 'This is not a valid campaign url' })
  @Contains('pay', { message: 'This is not a valid payment link' })
  @IsOptional()
  paymentLink!: string;

  @IsBoolean()
  @IsOptional()
  active!: boolean;
}
