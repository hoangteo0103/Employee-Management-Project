import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateLeaveDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  applicantID: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @ApiProperty()
  @IsString()
  type: string;

  @ApiProperty()
  @IsNotEmpty()
  startDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  endDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  appliedDate: Date;

  @ApiProperty({ example: 'Sick' })
  @IsNotEmpty()
  @IsString()
  reason: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'You can take a day off' })
  adminResponse: string;
}
