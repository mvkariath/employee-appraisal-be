import { IsEmail, IsEnum, IsNumber, IsOptional, IsString, ValidateNested } from "class-validator";
import { EmployeeRole, Status } from "../entities/employee.entity";

export class UpdateEmployeeDto {

  @IsOptional()
  @IsString()
  employeeId?: string

//   @IsNotEmpty()
  @IsOptional()
  @IsEmail()
  email?: string;

//   @IsNotEmpty()
  @IsOptional()
  @IsString()
  name?: string;

//   @IsNotEmpty()
  @IsOptional()
  @IsNumber()
  age?: number;

//   @IsNotEmpty()
  @IsOptional()
  password?: string;
  
  @IsOptional()
  department: string;

  @IsOptional()
  @IsEnum(EmployeeRole)
  role?: EmployeeRole

  // @IsOptional()
  // @ValidateNested()
  // @Type(() => CreateAddressDto)
  // address?: CreateAddressDto;

  @IsOptional()
  @IsNumber()
  experience?: number;

  @IsOptional()
  @IsEnum(Status)
  status?: Status
  
  @IsOptional()
  // @IsDate()
  dateOfJoining?: Date;
}