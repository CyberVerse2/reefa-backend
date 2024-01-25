// dto
import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { LoginDto } from "./login.dto";

export class SignupDto extends LoginDto {
  constructor(body: any) {
    super(body);
  }

  @IsNotEmpty()
  @IsBoolean({ message: "The terms and conditions is required" })
  isTermsAndConditionAccepted!: boolean;
}
