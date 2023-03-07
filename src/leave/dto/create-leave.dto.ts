export class CreateLeaveDto {
  applicantID: string;
  title: string;
  type: string;
  startDate: Date;
  endDate: Date;
  appliedDate: Date;
  reason: string;
  adminResponse: string;
}
