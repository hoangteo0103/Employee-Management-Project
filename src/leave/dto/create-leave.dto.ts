import { IsEmail, IsString, IsNotEmpty, IsDefined } from 'class-validator';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsString()
  applicantID: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  type: string;

  @IsNotEmpty()
  startDate: Date;

  @IsNotEmpty()
  endDate: Date;

  @IsNotEmpty()
  appliedDate: Date;

  @IsNotEmpty()
  @IsString()
  reason: string;
  adminResponse: string;
}
