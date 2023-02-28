import { IsEmail , IsNotEmpty } from "class-validator";
export class CreateUserDto {
    username: string;
    
    @IsEmail() 
    email: string;
    
    password: string;
    
    @IsNotEmpty()
    name : string;

    contactNumber : string;
    dateOfBirth : string ;
    refreshToken: string;
    Skills : string[] ;
    designation : string ; 
    department : string ;
  }