import { IsEmail , IsNotEmpty } from "class-validator";
export class CreateUserDto {
    @IsNotEmpty()  
    username: string;
    
    @IsEmail() 
    email: string;
    
    @IsNotEmpty()
    password: string;
    
    @IsNotEmpty()
    name : string;

    contactNumber : string;
    @IsNotEmpty()
    dateOfBirth : string ;
    refreshToken: string;
    Skills : string[] ;
    designation : string ; 
    department : string ;
  }