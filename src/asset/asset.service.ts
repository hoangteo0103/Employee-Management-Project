import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { AssetDocument } from './schemas/asset.schema';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name)
    private assetModel: Model<AssetDocument>,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const createdAsset = await new this.assetModel(createAssetDto);
    return createdAsset.save();
  }

  async findByID(id: string): Promise<AssetDocument> {
    const assets = await this.assetModel.findOne({
      id: id,
    });
    return assets;
  }

  async findByOwnerID(ownerID: string): Promise<AssetDocument[]> {
    const assets = await this.assetModel.find({
      ownerID: ownerID,
    });
    return assets;
  }

  async update(id: string, updateAssetDTO: UpdateAssetDto) {
    await this.assetModel.findByIdAndUpdate(
      new mongoose.Types.ObjectId(id),
      updateAssetDTO,
    );
  }

  async delete(id: string) {
    await this.assetModel.findByIdAndDelete(id);
  }
}
