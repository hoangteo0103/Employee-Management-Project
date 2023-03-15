import { CreateAttendanceDto } from './create-attendance.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {}
