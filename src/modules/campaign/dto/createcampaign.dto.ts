import {
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsEnum,
  IsOptional,
  Max,
  Min,
  IsUrl
} from 'class-validator';
import { BaseDto } from '../../../common/dto/base.dto';
import { BusinessCategory, RewardType } from '../campaigns.constants';

export class CreateCampaignDto extends BaseDto {
  constructor(body: any) {
    super(body);
    this.assignBody();
  }

  @IsNotEmpty()
  @MinLength(7, {
    message: 'A campaign name should have a minimum of 7 characters'
  })
  name!: string;

  @IsNotEmpty()
  @MaxLength(255, {
    message: 'A campaign description should have a maximum of 255 characters'
  })
  description!: string;

  @IsUrl(undefined, { message: 'This is not a valid photo url' })
  @IsOptional()
  photo?: string;

  @IsEnum(BusinessCategory, { message: 'Invalid category' })
  category!: BusinessCategory;

  @IsEnum(RewardType, { message: 'Invalid reward type' })
  reward!: RewardType;

  @Min(10, { message: 'A account number must be 10 digits minimum' })
  @Max(10000)
  rewardAmount!: number;
}
