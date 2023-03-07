import mongoose from 'mongoose';

export class CreateAssetDto {
  ownerID: mongoose.Schema.Types.ObjectId;
  name: string;
  quantity: number;
  status: string;
  description: string;
  type: string;
  receivedDate: Date;
}
