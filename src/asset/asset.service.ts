import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { CreateAssetDto } from './dto/create-asset.dto';
import { UpdateAssetDto } from './dto/update-asset.dto';
import { Asset } from './entities/asset.entity';
import { AssetDocument } from './schemas/asset.schema';

@Injectable()
export class AssetService {
  constructor(
    @InjectModel(Asset.name)
    private assetModel: Model<AssetDocument>,
    private usersService: UsersService,
  ) {}

  async create(createAssetDto: CreateAssetDto) {
    const createdAsset = await new this.assetModel(createAssetDto);
    const user = await this.usersService.findById(createAssetDto.owner);
    user.assets.push(createdAsset._id);
    await user.save();
    return createdAsset.save();
  }

  async findByID(id: string): Promise<AssetDocument> {
    const assets = await this.assetModel
      .findOne({
        id: id,
      })
      .populate('owner');
    return assets;
  }

  async findByOwnerID(owner: string): Promise<AssetDocument[]> {
    const assets = await this.assetModel.find({
      owner: owner,
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
