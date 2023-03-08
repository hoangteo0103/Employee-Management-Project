import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  Render,
  UseGuards,
} from '@nestjs/common';
import Role from '../users/role/roles.enum';
import RoleGuard from '../users/role/roles.guards';
import { UsersService } from '../users/users.service';
import * as moment from 'moment';
import { AssetService } from '../asset/asset.service';
import { CreateAssetDto } from '../asset/dto/create-asset.dto';
import { UpdateAssetDto } from '../asset/dto/update-asset.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@UseGuards(RoleGuard(Role.Admin))
@ApiBearerAuth('jwt')
@ApiTags('admin-asset-related')
@Controller('admin')
export class assetRelatedController {
  constructor(
    private userService: UsersService,
    private assetService: AssetService,
  ) {}
  // Asset
  @Get('all-employee-assets/:id')
  @Render('Admin/employeeAllAssets')
  async viewEmployeeeAssets(@Req() req) {
    const employeeID = req.params.id;
    const assets = await this.assetService.findByOwnerID(employeeID);
    return {
      title: 'List Of Employee Assets',
      hasAsset: assets.length > 0 ? 1 : 0,
      assets: assets,
      user: assets[0].owner,
      userName: req.user.name,
    };
  }

  @Get('add-employee-asset/:id')
  @Render('Admin/addAsset')
  async addAssetView(@Req() req) {
    const employeeID = req.params.id;
    const user = await this.userService.findById(employeeID);
    return {
      title: 'Add employee asset',
      employee: user,
      userName: req.user.name,
    };
  }

  @Post('add-employee-asset/:id')
  async addAsset(
    @Req() req,
    @Res() res,
    @Body() createAssetDto: CreateAssetDto,
  ) {
    const employeeID = req.params.id;
    createAssetDto.owner = employeeID;
    await this.assetService.create(createAssetDto);
    res.redirect(`/admin/all-employee-assets/${employeeID}`);
  }

  @Get('employee-asset-info/:id')
  @Render('Admin/assetInfo')
  async viewAssetInfo(@Req() req) {
    const assetID = req.params.id;

    const asset = await this.assetService.findByID(assetID);

    return {
      title: 'Employee Asset Info',
      moment: moment,
      asset: asset,
      employee: asset.owner,
      message: '',
      userName: req.user.name,
    };
  }

  @Get('edit-employee-asset/:id')
  @Render('Admin/editAsset')
  async editAssetView(@Req() req) {
    const assetID = req.params.id;

    const asset = await this.assetService.findByID(assetID);

    return {
      title: 'Employee Asset Edit',
      moment,
      asset: asset,
      message: '',
      userName: req.user.name,
    };
  }

  @Post('edit-employee-asset/:id')
  async editAsset(
    @Req() req,
    @Body() updateAssetDto: UpdateAssetDto,
    @Res() res,
  ) {
    const assetID = req.params.id;

    await this.assetService.update(assetID, updateAssetDto);
    res.redirect(`/admin/employee-asset-info/${assetID}`);
  }

  @Post('delete-employee-asset/:id')
  async deleteAsset(@Req() req, @Res() res) {
    const assetID = req.params.id;

    const asset = await this.assetService.findByID(assetID);
    this.assetService.delete(assetID);
    res.redirect(`/admin`);
  }
}
