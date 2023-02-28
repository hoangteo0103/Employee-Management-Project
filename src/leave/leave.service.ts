import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave } from './entities/leave.entity';
import { LeaveDocument } from './schema/leave.schema';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class LeaveService {
  constructor(@InjectModel(Leave.name) private leaveModel : Model<LeaveDocument>) {};
  async create(createLeaveDto: CreateLeaveDto) {
    await this.leaveModel.find({applicantID : createLeaveDto.applicantID , 
      appliedDate : createLeaveDto.appliedDate,
      startDate : createLeaveDto.startDate , 
      endDate : createLeaveDto.endDate ,
      title : createLeaveDto.title
    }).exec( (err , docs ) => {
      if(err)
      {
        console.log(err) ;
      }
      else {
        if(docs.length > 0 )
          throw(new BadRequestException('Leave already existed')) ;
      }
    })
    const createdLeave = new this.leaveModel(createLeaveDto) ; 
    return createdLeave.save() ; 
   }

  async findAll() : Promise<any> {
    let hasLeave = 0, leaveChunk = []; 
    const docs = await this.leaveModel.find().sort({_id : -1}).exec() ; 
    hasLeave = docs.length > 0 ? 1 : 0 ; 
    for(var i = 0 ; i < docs.length ; i++)
    {
      leaveChunk.push(docs[i]) ;
    }
    return {hasLeave : hasLeave , leaveChunk : leaveChunk};
  }
  
   async findOneById(id : string) : Promise<any> {
    const docs = await this.leaveModel.findById(id).exec() ; 
    return docs;

   }
   async findById(id: string): Promise<any> {
    let hasLeave = 0, leaveChunk = []; 
    const docs = await this.leaveModel.find({applicantID : id}).sort({_id : -1}).exec() ; 
    hasLeave = docs.length > 0 ? 1 : 0 ; 
    for(var i = 0 ; i < docs.length ; i++)
    {
      leaveChunk.push(docs[i]) ;
    }
    return {hasLeave : hasLeave , leaveChunk : leaveChunk};
  }

  async update(id, updateLeaveDto: Object)  {
    return  this.leaveModel.findByIdAndUpdate(id , updateLeaveDto , {new : true}).exec();
  }

  remove(id: number) {
    return `This action removes a #${id} leave`;
  }
}
