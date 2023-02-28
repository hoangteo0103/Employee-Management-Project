import { Prop , Schema , SchemaFactory } from "@nestjs/mongoose";
import mongoose , {Document} from "mongoose";

export type LeaveDocument = Leave & Document ; 

@Schema()
export class Leave {
    @Prop({required:true})
    applicantID : mongoose.Schema.Types.ObjectId ; 

    @Prop({required:true})
    title : string ;

    @Prop({required:true})
    type : String ; 

    @Prop({require:true})
    startDate : Date ;

    @Prop({require:true})
    endDate : Date ;
    
    @Prop({require:true})
    appliedDate : Date ;
    

    @Prop({require : true})
    reason : String ; 

    @Prop({default:"N/A"}) 
    adminResponse : String ;
}

export const LeaveSchema = SchemaFactory.createForClass(Leave);